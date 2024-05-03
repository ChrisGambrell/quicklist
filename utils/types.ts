import { Tables } from '@/db_types'
import { ReactNode } from 'react'

export type Generation = Tables<'generations'>
export type Listing = Tables<'listings'>
export type ListingImage = Tables<'listing_images'>
export type Rule = Tables<'rules'>
export type User = Tables<'users'>

export type ListingWithImages = Listing & { images: ListingImage[] }

export type Price = Tables<'prices'>
export type Product = Tables<'products'>
export type ProductAmount = Tables<'product_amounts'>
export type Purchase = Tables<'purchases'>
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
