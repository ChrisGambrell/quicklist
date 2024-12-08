import { env } from '@/env'
import { ListingImage } from '@prisma/client'

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
