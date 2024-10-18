import { ListingImage, Prisma } from '@prisma/client'
import { type ClassValue, clsx } from 'clsx'
import { ReactNode } from 'react'
import { twMerge } from 'tailwind-merge'

export type AuthUser = Prisma.UserGetPayload<{ include: { subscriptions: { include: { price: { include: { product: true } } } } } }>

export type NavLinkProps = {
	exact?: boolean
	href: string
	icon: ReactNode
	label: string
}

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}

export const getImageUrl = (path: ListingImage['imagePath']) =>
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
