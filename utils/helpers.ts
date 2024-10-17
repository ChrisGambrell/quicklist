import { ZodTypeAny, z } from 'zod'
import { ListingImage } from './types'

export const getImageUrl = (path: ListingImage['image_path']) =>
	`${process.env.NEXT_PUBLIC_SUPABASE_URL!}/storage/v1/object/public/listing_images/${path}`

export function requiredCredits(num: number) {
	if (num === 0) return 0
	if (num < 3) return 1
	return Math.round(num / 3)
}

export const toDateTime = (secs: number) => {
	var t = new Date(+0)
	t.setSeconds(secs)
	return t
}

export const calculateTrialEndUnixTimestamp = (trialPeriodDays: number | null | undefined) => {
	// Check if trialPeriodDays is null, undefined, or less than 2 days
	if (trialPeriodDays === null || trialPeriodDays === undefined || trialPeriodDays < 2) {
		return undefined
	}

	const currentDate = new Date() // Current date and time
	const trialEnd = new Date(currentDate.getTime() + (trialPeriodDays + 1) * 24 * 60 * 60 * 1000) // Add trial days
	return Math.floor(trialEnd.getTime() / 1000) // Convert to Unix timestamp in seconds
}

export const parseFormData = <T extends ZodTypeAny>(
	formData: FormData,
	schema: T
): { data: z.infer<T>; errors?: undefined } | { data?: undefined; errors: z.inferFlattenedErrors<T>['fieldErrors'] } => {
	const data = Object.fromEntries(formData)
	const parsedData = schema.safeParse(data)

	if (!parsedData.success) return { errors: parsedData.error.flatten().fieldErrors }
	return { data: parsedData.data }
}
