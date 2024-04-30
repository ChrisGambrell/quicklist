import { createClient } from '@supabase/supabase-js'
import Stripe from 'stripe'
import { Database, Tables } from '../db_types'

type OmitDates<T> = Omit<T, 'created_at' | 'updated_at'>
type Product = OmitDates<Tables<'products'>>
type ProductAmount = OmitDates<Tables<'product_amounts'>>
type Price = OmitDates<Tables<'prices'>>

const TRIAL_PERIOD_DAYS = 0
const supabaseAdmin = createClient<Database>(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2024-04-10' })

const upsertProductRecord = async (product: Stripe.Product) => {
	if (!product.metadata.listing_amount) throw new Error(`Product metadata listing amount is missing: ${product.id}`)
	else if (!product.metadata.rule_amount) throw new Error(`Product metadata rule amount is missing: ${product.id}`)

	const productData: Product = {
		id: product.id,
		active: product.active,
		name: product.name,
		description: product.description ?? null,
		image: product.images?.[0] ?? null,
		metadata: product.metadata,
	}

	const amountData: ProductAmount = {
		id: product.id,
		listing_amount: +product.metadata.listing_amount,
		rule_amount: +product.metadata.rule_amount,
	}

	const { error: upsertError } = await supabaseAdmin.from('products').upsert([productData])
	if (upsertError) throw new Error(`Product insert/update failed: ${upsertError.message}`)

	const { error: upsertAmountError } = await supabaseAdmin.from('product_amounts').upsert([amountData])
	if (upsertAmountError) throw new Error(`Product insert/update failed: ${upsertAmountError.message}`)

	console.log(`Product inserted/updated: ${product.id}`)
}

const upsertPriceRecord = async (price: Stripe.Price, retryCount = 0, maxRetries = 3) => {
	const priceData: Price = {
		id: price.id,
		product_id: typeof price.product === 'string' ? price.product : '',
		active: price.active,
		currency: price.currency,
		type: price.type,
		unit_amount: price.unit_amount ?? null,
		interval: price.recurring?.interval ?? null,
		interval_count: price.recurring?.interval_count ?? null,
		trial_period_days: price.recurring?.trial_period_days ?? TRIAL_PERIOD_DAYS,
	}

	const { error: upsertError } = await supabaseAdmin.from('prices').upsert([priceData])

	if (upsertError?.message.includes('foreign key constraint')) {
		if (retryCount < maxRetries) {
			console.log(`Retry attempt ${retryCount + 1} for price ID: ${price.id}`)
			await new Promise((resolve) => setTimeout(resolve, 2000))
			await upsertPriceRecord(price, retryCount + 1, maxRetries)
		} else {
			throw new Error(`Price insert/update failed after ${maxRetries} retries: ${upsertError.message}`)
		}
	} else if (upsertError) {
		throw new Error(`Price insert/update failed: ${upsertError.message}`)
	} else {
		console.log(`Price inserted/updated: ${price.id}`)
	}
}

async function retrieveStripeProducts() {
	const products = await stripe.products.list()
	return products.data
}

async function retrieveStripePrices() {
	const prices = await stripe.prices.list()
	return prices.data
}

async function main() {
	const products = await retrieveStripeProducts()
	await Promise.all(products.map((product) => upsertProductRecord(product)))

	const prices = await retrieveStripePrices()
	await Promise.all(prices.map((price) => upsertPriceRecord(price)))
}

main()
