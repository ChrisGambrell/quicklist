'use server'

import prisma from '@/lib/db'
import { stripe } from '@/utils/stripe/config'
import { Prisma, Subscription, User } from '@prisma/client'
import Stripe from 'stripe'

const TRIAL_PERIOD_DAYS = 0

export const upsertProductRecord = async (product: Stripe.Product) => {
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
		...(product.metadata.credits ? { credits: Number(product.metadata.credits) } : {}),
	}

	await prisma.product.upsert({ where: { id: product.id }, create: productData, update: productData })
	await prisma.productAmount.upsert({ where: { productId: product.id }, create: amountData, update: amountData })
	console.log(`Product inserted/updated: ${product.id}`)
}

export const upsertPriceRecord = async (price: Stripe.Price) => {
	const priceData: Prisma.PriceCreateInput = {
		id: price.id,
		product: { connect: { id: typeof price.product === 'string' ? price.product : '' } },
		active: price.active,
		currency: price.currency,
		type: price.type,
		unitAmount: price.unit_amount ?? null,
		interval: price.recurring?.interval ?? null,
		intervalCount: price.recurring?.interval_count ?? null,
		trialPeriodDays: price.recurring?.trial_period_days ?? TRIAL_PERIOD_DAYS,
	}

	await prisma.price.upsert({ where: { id: price.id }, create: priceData, update: priceData })
	console.log(`Price inserted/updated: ${price.id}`)
}

export const deleteProductRecord = async (product: Stripe.Product) => {
	await prisma.product.delete({ where: { id: product.id } })
	console.log(`Product deleted: ${product.id}`)
}

export const deletePriceRecord = async (price: Stripe.Price) => {
	await prisma.price.delete({ where: { id: price.id } })
	console.log(`Price deleted: ${price.id}`)
}

export const upsertCustomer = async (userId: User['id'], stripeCustomerId: User['stripeCustomerId']) => {
	await prisma.user.update({ where: { id: userId }, data: { stripeCustomerId } })
	return stripeCustomerId
}

export const createCustomerInStripe = async (userId: User['id'], email: User['email']) => {
	const customerData = { metadata: { prismaUserId: userId }, email }
	const newCustomer = await stripe.customers.create(customerData)
	if (!newCustomer) throw new Error('Stripe customer creation failed.')

	return newCustomer.id
}

export const createOrRetrieveCustomer = async ({ email, userId }: { email: User['email']; userId: User['id'] }) => {
	// Check if the customer already exists in DB
	const existingCustomer = await prisma.user.findFirst({ where: { id: userId, stripeCustomerId: { not: null } } })

	// Retrieve the Stripe customer ID using the DB customer ID, with email fallback
	let stripeCustomerId: string | undefined
	if (existingCustomer?.stripeCustomerId) {
		const existingStripeCustomer = await stripe.customers.retrieve(existingCustomer.stripeCustomerId)
		stripeCustomerId = existingStripeCustomer.id
	} else {
		// If Stripe ID is missing from DB, try to retrieve Stripe customer ID by email
		const stripeCustomers = await stripe.customers.list({ email })
		stripeCustomerId = stripeCustomers.data.length ? stripeCustomers.data[0].id : undefined
	}

	// If still no stripeCustomerId, create a new customer in Stripe
	const stripeIdToInsert = stripeCustomerId ? stripeCustomerId : await createCustomerInStripe(userId, email)
	if (!stripeIdToInsert) throw new Error('Stripe customer creation failed.')

	if (existingCustomer && stripeCustomerId) {
		// If DB has a record but doesn't match Stripe, update DB record
		if (existingCustomer.stripeCustomerId !== stripeCustomerId) {
			await prisma.user.update({ where: { id: userId }, data: { stripeCustomerId } })
			console.warn(`DB customer record mismatched Stripe ID. DB record updated.`)
		}

		// If DB has a record and matches Stripe, return Stripe customer ID
		return stripeCustomerId
	} else {
		console.warn(`DB customer record was missing. A new record was created.`)

		// If DB has no record, create a new record and return Stripe customer ID
		const upsertedStripeCustomer = await upsertCustomer(userId, stripeIdToInsert)
		if (!upsertedStripeCustomer) throw new Error('DB customer record creation failed.')

		return upsertedStripeCustomer
	}
}

export const manageSubscriptionStatusChange = async (
	subscriptionId: Subscription['id'],
	stripeCustomerId: User['stripeCustomerId'],
	createAction = false
) => {
	// Get customer's UUID from mapping table.
	const customer = await prisma.user.findFirst({ where: { stripeCustomerId } })
	const { id: userId } = customer!

	const subscription = await stripe.subscriptions.retrieve(subscriptionId, { expand: ['default_payment_method'] })

	// TODO: Check all of these to make sure they're used and correct
	const subscriptionData: Prisma.SubscriptionCreateInput = {
		id: subscription.id,
		user: { connect: { id: userId } },
		metadata: subscription.metadata,
		staus: subscription.status,
		price: { connect: { id: subscription.items.data[0].price.id } },
		// TODO: ts-ignore
		// @ts-ignore
		quantity: subscription.quantity,
		cancelAtPeriodEnd: subscription.cancel_at_period_end,
		canceledAt: subscription.cancel_at ? toDateTime(subscription.cancel_at).toISOString() : null,
		// TODO: Missing in db
		// canceled_at: subscription.canceled_at ? toDateTime(subscription.canceled_at).toISOString() : null,
		currentPeriodStart: toDateTime(subscription.current_period_start).toISOString(),
		currentPeriodEnd: toDateTime(subscription.current_period_end).toISOString(),
		createdAt: toDateTime(subscription.created).toISOString(),
		endedAt: subscription.ended_at ? toDateTime(subscription.ended_at).toISOString() : null,
		trialStart: subscription.trial_start ? toDateTime(subscription.trial_start).toISOString() : null,
		trialEnd: subscription.trial_end ? toDateTime(subscription.trial_end).toISOString() : null,
	}

	await prisma.subscription.upsert({ where: { id: subscription.id }, create: subscriptionData, update: subscriptionData })
	console.log(`Inserted/updated subscription [${subscription.id}] for user [${userId}]`)
}

export const upsertPurchaseRecord = async (lineItem: Stripe.LineItem, stripeCustomerId: User['stripeCustomerId']) => {
	if (!lineItem.price) throw new Error(`Line item price is missing: ${lineItem.id}`)

	const customer = await prisma.user.findFirst({ where: { stripeCustomerId } })
	const { id: userId } = customer!

	const purchaseData: Prisma.PurchaseCreateInput = {
		price: { connect: { id: lineItem.price.id } },
		user: { connect: { id: userId } },
	}

	await prisma.purchase.upsert({ where: { id: lineItem.id }, create: purchaseData, update: purchaseData })
	console.log(`Inserted/updated purchase for user [${userId}]`)
}

const toDateTime = (secs: number) => {
	var t = new Date(+0)
	t.setSeconds(secs)
	return t
}
