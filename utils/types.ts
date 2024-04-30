import { Enums, Tables } from '@/db_types'
import { ReactNode } from 'react'

export type BillingInterval = Enums<'pricing_plan_interval'>

export type Price = Tables<'prices'>
export type Product = Tables<'products'>
export type ProductAmount = Tables<'product_amounts'>
export type Subscription = Tables<'subscriptions'>

export type ProductWithPrices = Product & { prices: Price[] }

export type SubscriptionWithPriceWithProductWithAmount = Subscription & {
	price: Price & { product: Product & { amount: ProductAmount } }
}

export type CheckoutResponse = {
	errorRedirect?: string
	sessionId?: string
}

export type NavLinkProps = {
	exact?: boolean
	href: string
	icon: ReactNode
	label: string
}

export type SignedImage = {
	error: string | null
	path: string | null
	signedUrl: string
}
