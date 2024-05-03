'use server'

import { getErrorRedirect, getURL } from '@cgambrell/utils'
import Stripe from 'stripe'
import { getAuth } from '../_helpers'
import { calculateTrialEndUnixTimestamp } from '../helpers'
import { createOrRetrieveCustomer } from '../supabase/admin'
import { CheckoutResponse, Price } from '../types'
import { stripe } from './config'

export async function checkoutWithStripe(price: Price, redirectPath: string = '/account'): Promise<CheckoutResponse> {
	try {
		const { user } = await getAuth()

		// Retrieve or create the customer in Stripe
		let customer: string
		try {
			customer = await createOrRetrieveCustomer({
				uuid: user?.id || '',
				email: user?.email || '',
			})
		} catch (err) {
			console.error(err)
			throw new Error('Unable to access customer record.')
		}

		let params: Stripe.Checkout.SessionCreateParams = {
			allow_promotion_codes: true,
			billing_address_collection: 'required',
			customer,
			customer_update: {
				address: 'auto',
			},
			line_items: [
				{
					price: price.id,
					quantity: 1,
				},
			],
			cancel_url: getURL(),
			success_url: getURL(redirectPath),
		}

		console.log('Trial end:', calculateTrialEndUnixTimestamp(price.trial_period_days))
		if (price.type === 'recurring')
			params = {
				...params,
				mode: 'subscription',
				subscription_data: {
					trial_end: calculateTrialEndUnixTimestamp(price.trial_period_days),
				},
			}
		else if (price.type === 'one_time')
			params = {
				...params,
				mode: 'payment',
			}

		// Create a checkout session in Stripe
		let session
		try {
			session = await stripe.checkout.sessions.create(params)
		} catch (err) {
			console.error(err)
			throw new Error('Unable to create checkout session.')
		}

		// Instead of returning a Response, just return the data or error.
		if (session) return { sessionId: session.id }
		else throw new Error('Unable to create checkout session.')
	} catch (error) {
		if (error instanceof Error)
			return {
				errorRedirect: getErrorRedirect(redirectPath, error.message),
			}
		else
			return {
				errorRedirect: getErrorRedirect(redirectPath, 'An unknown error occurred.'),
			}
	}
}

export async function createStripePortal(currentPath: string) {
	try {
		const { user } = await getAuth()

		let customer
		try {
			customer = await createOrRetrieveCustomer({
				uuid: user.id || '',
				email: user.email || '',
			})
		} catch (err) {
			console.error(err)
			throw new Error('Unable to access customer record.')
		}

		if (!customer) throw new Error('Could not get customer.')

		try {
			const { url } = await stripe.billingPortal.sessions.create({
				customer,
				return_url: getURL('/'),
			})
			if (!url) throw new Error('Could not create billing portal')

			return url
		} catch (err) {
			console.error(err)
			throw new Error('Could not create billing portal')
		}
	} catch (error) {
		if (error instanceof Error) {
			console.error(error)
			return getErrorRedirect(currentPath, error.message)
		} else return getErrorRedirect(currentPath, 'An unknown error occurred.')
	}
}
