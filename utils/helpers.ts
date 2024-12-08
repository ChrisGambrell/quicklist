import { env } from '@/env'
import { ListingImage } from './types'

// TODO: Use this in generation function
export const getImageUrl = (path: ListingImage['image_path']) =>
	`${env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/listing_images/${path}`

// TODO: Use this in generation function
export function requiredCredits(num: number) {
	if (num === 0) return 0
	if (num < 3) return 1
	return Math.round(num / 3)
}
