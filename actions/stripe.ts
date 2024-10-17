'use server'

import prisma from '@/lib/db'
import { toDateTime } from '@/utils/helpers'
import { stripe } from '@/utils/stripe/config'
import { Prisma } from '@prisma/client'
import Stripe from 'stripe'

const TRIAL_PERIOD_DAYS = 0

const upsertProductRecord = async (product: Stripe.Product) => {
	const productData: Prisma.ProductCreateInput = {
		id: product.id,
		active: product.active,
		name: product.name,
		desc: product.description ?? null,
		image: product.images?.[0] ?? null,
		metadata: product.metadata,
	}

	const amountData: Prisma.ProductAmountCreateInput = {
		product: { connect: { id: product.id } },
		...(product.metadata.credits ? { credits: +product.metadata.credits } : {}),
	}

	await prisma.product.upsert({ where: { id: product.id }, create: productData, update: productData })
	await prisma.productAmount.upsert({ where: { id: product.id }, create: amountData, update: amountData })

	console.log(`Product inserted/updated: ${product.id}`)
}

const upsertPriceRecord = async (price: Stripe.Price) => {
	const priceData: Prisma.PriceCreateInput = {
		id: price.id,
		product: { connect: { id: price.product as string } },
		active: price.active,
		currency: price.currency,
		type: price.type,
		unitAmount: price.unit_amount ?? null,
		interval: price.recurring?.interval ?? null,
		intervalCount: price.recurring?.interval_count ?? null,
		trialPeriodDays: price.recurring?.trial_period_days ?? TRIAL_PERIOD_DAYS,
	}

	await prisma.price.upsert({ where: { id: price.id }, create: priceData, update: priceData })
}

const deleteProductRecord = async (product: Stripe.Product) => {
	await prisma.product.delete({ where: { id: product.id } })
	console.log(`Product deleted: ${product.id}`)
}

const deletePriceRecord = async (price: Stripe.Price) => {
	await prisma.price.delete({ where: { id: price.id } })
	console.log(`Price deleted: ${price.id}`)
}

const upsertCustomer = async (uuid: string, customerId: string) => {
	await prisma.customer.update({ where: { id: uuid }, data: { stripeCustomerId: customerId } })
	return customerId
}

const createCustomerInStripe = async (uuid: string, email: string) => {
	const customerData = { metadata: { supabaseUUID: uuid }, email: email }
	const newCustomer = await stripe.customers.create(customerData)
	if (!newCustomer) throw new Error('Stripe customer creation failed.')

	return newCustomer.id
}

const createOrRetrieveCustomer = async ({ email, uuid }: { email: string; uuid: string }) => {
	// Check if the customer already exists
	const existingCustomer = await prisma.customer.findUnique({ where: { id: uuid } })

	// Retrieve the Stripe customer ID using the customer ID, with email fallback
	let stripeCustomerId: string | undefined
	if (existingCustomer?.stripeCustomerId) {
		const existingStripeCustomer = await stripe.customers.retrieve(existingCustomer.stripeCustomerId)
		stripeCustomerId = existingStripeCustomer.id
	} else {
		// If Stripe ID is missing, try to retrieve Stripe customer ID by email
		const stripeCustomers = await stripe.customers.list({ email: email })
		stripeCustomerId = stripeCustomers.data.length ? stripeCustomers.data[0].id : undefined
	}

	// If still no stripeCustomerId, create a new customer in Stripe
	const stripeIdToInsert = stripeCustomerId ? stripeCustomerId : await createCustomerInStripe(uuid, email)
	if (!stripeIdToInsert) throw new Error('Stripe customer creation failed.')

	if (existingCustomer && stripeCustomerId) {
		// If DB has a record but doesn't match Stripe, update DB record
		if (existingCustomer.stripeCustomerId !== stripeCustomerId) {
			await prisma.customer.update({ where: { id: uuid }, data: { stripeCustomerId: stripeCustomerId } })
			console.warn(`DB customer record mismatched Stripe ID. DB record updated.`)
		}
		// If DB has a record and matches Stripe, return Stripe customer ID
		return stripeCustomerId
	} else {
		console.warn(`DB customer record was missing. A new record was created.`)

		// If DB has no record, create a new record and return Stripe customer ID
		const upsertedStripeCustomer = await upsertCustomer(uuid, stripeIdToInsert)
		if (!upsertedStripeCustomer) throw new Error('DB customer record creation failed.')

		return upsertedStripeCustomer
	}
}

/**
 * Copies the billing details from the payment method to the customer object.
 */
const copyBillingDetailsToCustomer = async (uuid: string, payment_method: Stripe.PaymentMethod) => {
	//Todo: check this assertion
	const customer = payment_method.customer as string
	const { name, phone, address } = payment_method.billing_details
	if (!name || !phone || !address) return
	//@ts-ignore
	await stripe.customers.update(customer, { name, phone, address })
	await prisma.user.update({
		where: { id: uuid },
		data: { billingAddress: { ...address }, paymentMethod: { ...(payment_method[payment_method.type] ?? undefined) } },
	})
}

const manageSubscriptionStatusChange = async (subscriptionId: string, customerId: string, createAction = false) => {
	// Get customer's UUID from mapping table.
	const customerData = await prisma.customer.findFirst({ where: { stripeCustomerId: customerId } })
	const { id: uuid } = customerData!

	const subscription = await stripe.subscriptions.retrieve(subscriptionId, {
		expand: ['default_payment_method'],
	})
	// Upsert the latest status of the subscription object.
	const subscriptionData: Prisma.SubscriptionCreateInput = {
		id: subscription.id,
		user: { connect: { id: uuid } },
		metadata: subscription.metadata,
		status: subscription.status,
		price: { connect: { id: subscription.items.data[0].price.id } },
		// @ts-ignore
		quantity: subscription.quantity,
		cancelAtPeriodEnd: subscription.cancel_at_period_end,
		cancelAt: subscription.cancel_at ? toDateTime(subscription.cancel_at).toISOString() : null,
		canceledAt: subscription.canceled_at ? toDateTime(subscription.canceled_at).toISOString() : null,
		currentPeriodStart: toDateTime(subscription.current_period_start).toISOString(),
		currentPeriodEnd: toDateTime(subscription.current_period_end).toISOString(),
		createdAt: toDateTime(subscription.created).toISOString(),
		endedAt: subscription.ended_at ? toDateTime(subscription.ended_at).toISOString() : null,
		trialStart: subscription.trial_start ? toDateTime(subscription.trial_start).toISOString() : null,
		trialEnd: subscription.trial_end ? toDateTime(subscription.trial_end).toISOString() : null,
	}

	await prisma.subscription.upsert({ where: { id: subscription.id }, create: subscriptionData, update: subscriptionData })
	console.log(`Inserted/updated subscription [${subscription.id}] for user [${uuid}]`)

	// For a new subscription copy the billing details to the customer object.
	// NOTE: This is a costly operation and should happen at the very end.
	if (createAction && subscription.default_payment_method && uuid)
		//@ts-ignore
		await copyBillingDetailsToCustomer(uuid, subscription.default_payment_method as Stripe.PaymentMethod)
}

const upsertPurchaseRecord = async (lineItem: Stripe.LineItem, customerId: string) => {
	if (!lineItem.price) throw new Error(`Line item price is missing: ${lineItem.id}`)
	const customerData = await prisma.customer.findFirst({ where: { stripeCustomerId: customerId } })

	const { id: uuid } = customerData!
	const purchaseData: Prisma.PurchaseCreateInput = {
		price: { connect: { id: lineItem.price?.id } },
		user: { connect: { id: uuid } },
	}

	await prisma.purchase.upsert({ where: { id: lineItem.id }, create: purchaseData, update: purchaseData })
	console.log(`Inserted/updated purchase for user [${uuid}]`)
}

export {
	createOrRetrieveCustomer,
	deletePriceRecord,
	deleteProductRecord,
	manageSubscriptionStatusChange,
	upsertPriceRecord,
	upsertProductRecord,
	upsertPurchaseRecord,
}
