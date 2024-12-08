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

// TODO: Move to where this is used
export const toDateTime = (secs: number) => {
	var t = new Date(+0)
	t.setSeconds(secs)
	return t
}

// TODO: Move to where this is used
export const calculateTrialEndUnixTimestamp = (trialPeriodDays: number | null | undefined) => {
	// Check if trialPeriodDays is null, undefined, or less than 2 days
	if (trialPeriodDays === null || trialPeriodDays === undefined || trialPeriodDays < 2) {
		return undefined
	}

	const currentDate = new Date() // Current date and time
	const trialEnd = new Date(currentDate.getTime() + (trialPeriodDays + 1) * 24 * 60 * 60 * 1000) // Add trial days
	return Math.floor(trialEnd.getTime() / 1000) // Convert to Unix timestamp in seconds
}
