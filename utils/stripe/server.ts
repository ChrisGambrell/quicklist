'use server'

import { auth } from '@/lib/auth'
import { getErrorRedirect, getSuccessRedirect, getURL } from '@cgambrell/utils'
import { Price } from '@prisma/client'
import Stripe from 'stripe'
import { createOrRetrieveCustomer } from '../../actions/stripe'
import { CheckoutResponse } from '../types'
import { stripe } from './config'

export async function checkoutWithStripe(price: Price): Promise<CheckoutResponse> {
	try {
		const user = await auth()

		// Retrieve or create the customer in Stripe
		let customer: string
		try {
			customer = await createOrRetrieveCustomer({ email: user?.email, userId: user?.id })
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
			cancel_url: getURL('/pricing'),
			success_url: getURL(getSuccessRedirect('/listings', 'Purchase successful.')),
		}

		console.log('Trial end:', calculateTrialEndUnixTimestamp(price.trialPeriodDays))
		if (price.type === 'recurring')
			params = {
				...params,
				mode: 'subscription',
				subscription_data: {
					trial_end: calculateTrialEndUnixTimestamp(price.trialPeriodDays),
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
				errorRedirect: getErrorRedirect('/pricing', error.message),
			}
		else
			return {
				errorRedirect: getErrorRedirect('/pricing', 'An unknown error occurred.'),
			}
	}
}

export async function createStripePortal(currentPath: string) {
	try {
		const user = await auth()

		let customer
		try {
			customer = await createOrRetrieveCustomer({ email: user.email, userId: user.id })
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

const calculateTrialEndUnixTimestamp = (trialPeriodDays: number | null | undefined) => {
	// Check if trialPeriodDays is null, undefined, or less than 2 days
	if (trialPeriodDays === null || trialPeriodDays === undefined || trialPeriodDays < 2) {
		return undefined
	}

	const currentDate = new Date() // Current date and time
	const trialEnd = new Date(currentDate.getTime() + (trialPeriodDays + 1) * 24 * 60 * 60 * 1000) // Add trial days
	return Math.floor(trialEnd.getTime() / 1000) // Convert to Unix timestamp in seconds
}
