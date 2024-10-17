'use server'

import { auth } from '@/lib/auth'
import prisma from '@/lib/db'
import { parseFormData } from '@/utils/helpers'
import { updateListingSchema } from '@/validators/listing'
import { getSuccessRedirect } from '@cgambrell/utils'
import { Listing } from '@prisma/client'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createListing() {
	const user = await auth()
	const newListing = await prisma.listing.create({ data: { userId: user.id } })

	revalidatePath('/listings', 'layout')
	redirect(`/listings/${newListing.id}/edit`)
}

export async function updateListing({ listingId }: { listingId: Listing['id'] }, formData: FormData) {
	const { data, errors } = parseFormData(formData, updateListingSchema)
	if (errors) return { errors }

	await prisma.listing.update({ where: { id: listingId }, data })

	revalidatePath(`/listings/${listingId}/edit`, 'page')
	redirect(getSuccessRedirect(`/listings/${listingId}/edit`, 'Listing updated'))
}

export async function deleteListing({ listingId }: { listingId: Listing['id'] }) {
	await prisma.listing.delete({ where: { id: listingId } })

	revalidatePath('/listings', 'layout')
	redirect(getSuccessRedirect('/listings', 'Listing deleted'))
}

// BUG: Need to do this with prisma
// export async function generateListingData({ listingId }: { listingId: Listing['id'] }) {
// 	const supabase = createClient()

// 	const { data, error } = await supabase.functions.invoke('generate-listing-details', { body: { listingId } })

// 	if (error || !data) {
// 		let errorMessage = error?.message ?? 'An unexpected error occurred'
// 		if (error instanceof FunctionsHttpError) {
// 			errorMessage = (await error.context.json()).error
// 		}
// 		redirect(
// 			getErrorRedirect(
// 				errorMessage === 'Not enough credits to generate data' ? '/pricing' : `/listings/${listingId}/edit`,
// 				errorMessage
// 			)
// 		)
// 	}

// 	revalidatePath(`/listings/${listingId}/edit`, 'page')
// 	redirect(getSuccessRedirect(`/listings/${listingId}/edit`, 'Listing data generated'))
// }

// BUG: Need to do this with prisma
// export async function deleteImage({ listingId, path }: { listingId: Listing['id']; path: ListingImage['image_path'] }) {
// 	const supabase = createClient()

// 	const { error } = await supabase.storage.from('listing_images').remove([path])
// 	if (error) redirect(getErrorRedirect(`/listings/${listingId}/edit`, error.message))

// 	revalidatePath(`/listings/${listingId}/edit`, 'page')
// 	redirect(getSuccessRedirect(`/listings/${listingId}/edit`, 'Image deleted'))
// }
