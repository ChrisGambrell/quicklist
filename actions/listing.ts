'use server'

import { getAuth } from '@/utils/_helpers'
import { parseFormData } from '@/utils/helpers'
import { createClient } from '@/utils/supabase/server'
import { Listing, ListingImage } from '@/utils/types'
import { updateListingSchema } from '@/validators/listing'
import { getErrorRedirect, getSuccessRedirect } from '@cgambrell/utils'
import { FunctionsHttpError } from '@supabase/supabase-js'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createListing() {
	const { auth, supabase } = await getAuth()

	const { data, error } = await supabase.from('listings').insert({ user_id: auth.id }).select().single()
	if (error || !data) redirect(getErrorRedirect('/listings', error.message ?? 'An unexpected error occurred'))

	revalidatePath('/listings', 'layout')
	redirect(`/listings/${data.id}/edit`)
}

export async function updateListing({ listingId }: { listingId: Listing['id'] }, formData: FormData) {
	const { data, errors } = parseFormData(formData, updateListingSchema)
	if (errors) return { errors }

	const supabase = createClient()

	const { error } = await supabase.from('listings').update(data).eq('id', listingId)
	if (error) redirect(getErrorRedirect(`/listings/${listingId}/edit`, error.message))

	revalidatePath(`/listings/${listingId}/edit`, 'page')
	redirect(getSuccessRedirect(`/listings/${listingId}/edit`, 'Listing updated'))
}

export async function deleteListing({ listingId }: { listingId: Listing['id'] }) {
	const supabase = createClient()

	const { error } = await supabase.from('listings').delete().eq('id', listingId)
	if (error) redirect(getErrorRedirect(`/listings/${listingId}/edit`, error.message))

	revalidatePath('/listings', 'layout')
	redirect(getSuccessRedirect('/listings', 'Listing deleted'))
}

export async function generateListingData({ listingId }: { listingId: Listing['id'] }) {
	const supabase = createClient()

	const { data, error } = await supabase.functions.invoke('generate-listing-details', { body: { listingId } })

	if (error || !data) {
		let errorMessage = error?.message ?? 'An unexpected error occurred'
		if (error instanceof FunctionsHttpError) {
			errorMessage = (await error.context.json()).error
		}
		redirect(
			getErrorRedirect(
				errorMessage === 'Not enough credits to generate data' ? '/pricing' : `/listings/${listingId}/edit`,
				errorMessage
			)
		)
	}

	revalidatePath(`/listings/${listingId}/edit`, 'page')
	redirect(getSuccessRedirect(`/listings/${listingId}/edit`, 'Listing data generated'))
}

export async function deleteImage({ listingId, path }: { listingId: Listing['id']; path: ListingImage['image_path'] }) {
	const supabase = createClient()

	const { error } = await supabase.storage.from('listing_images').remove([path])
	if (error) redirect(getErrorRedirect(`/listings/${listingId}/edit`, error.message))

	revalidatePath(`/listings/${listingId}/edit`, 'page')
	redirect(getSuccessRedirect(`/listings/${listingId}/edit`, 'Image deleted'))
}
