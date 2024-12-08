import { ListingImage, Prisma, User } from '@prisma/client'
import { type ClassValue, clsx } from 'clsx'
import { env } from 'process'
import { twMerge } from 'tailwind-merge'

export type AuthUser = Prisma.UserGetPayload<{
	include: { subscriptions: { include: { price: { include: { product: { include: { productAmount: true } } } } } } }
}>

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}

// TODO: Use this in generation function
export const getImageUrl = (path: ListingImage['imagePath']) =>
	`${env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/listing_images/${path}`

// TODO: Use this in generation function
export function requiredCredits(num: number) {
	if (num === 0) return 0
	if (num < 3) return 1
	return Math.round(num / 3)
}

// BUG: Need to fix this
export async function getRemainingCredits() {
	const { data: purchasedCredits } = { data: 0 } //await supabase.rpc('get_total_credits')
	const { data: usedCredits } = { data: 0 } //await supabase.rpc('get_used_credits')

	return (purchasedCredits ?? 0) - (usedCredits ?? 0)
}
