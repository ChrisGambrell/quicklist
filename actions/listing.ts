'use server'

import { Tables } from '@/db_types'
import { getAuth } from '@/utils/_helpers'
import { parseFormData } from '@/utils/helpers'
import { createClient } from '@/utils/supabase/server'
import { getErrorRedirect, getSuccessRedirect } from '@cgambrell/utils'
import { redirect } from 'next/navigation'
import { z } from 'zod'

const updateListingSchema = z.object({
	title: z.string().transform((arg) => (!arg.trim() ? null : arg)),
	description: z.string().transform((arg) => (!arg.trim() ? null : arg)),
	price: z
		.string()
		.transform((arg) => (!arg.trim() ? null : arg))
		.pipe(z.coerce.number().nullable()),
})

export async function createListing() {
	const { auth, supabase } = await getAuth()

	const { data, error } = await supabase.from('listings').insert({ user_id: auth.id }).select().single()
	if (error || !data) redirect(getErrorRedirect('/listings', error.message ?? 'An unexpected error occurred'))

	redirect(`/listings/${data.id}/edit`)
}

export async function updateListing({ listingId }: { listingId: Tables<'listings'>['id'] }, _prevState: any, formData: FormData) {
	const { data, errors } = parseFormData(formData, updateListingSchema)
	if (errors) return { errors }

	const supabase = createClient()

	const { error } = await supabase.from('listings').update(data).eq('id', listingId)
	if (error) redirect(getErrorRedirect(`/listings/${listingId}/edit`, error.message))

	redirect(getSuccessRedirect(`/listings/${listingId}/edit`, 'Listing updated'))
}

export async function deleteListing({ listingId }: { listingId: Tables<'listings'>['id'] }) {
	const supabase = createClient()

	const { error } = await supabase.from('listings').delete().eq('id', listingId)
	if (error) redirect(getErrorRedirect(`/listings/${listingId}/edit`, error.message))

	redirect(getSuccessRedirect('/listings', 'Listing deleted'))
}

export async function generateListingData({ listingId }: { listingId: Tables<'listings'>['id'] }) {
	const supabase = createClient()

	const { data, error } = await supabase.functions.invoke('generate-listing-details', { body: { listingId } })
	if (error || !data) redirect(getErrorRedirect(`/listings/${listingId}/edit`, error?.message ?? 'An unexpected error occurred'))

	redirect(getSuccessRedirect(`/listings/${listingId}/edit`, 'Listing data generated'))
}

export async function deleteImage({ listingId }: { listingId: Tables<'listings'>['id'] }, path: string | null) {
	if (!path) redirect(getErrorRedirect(`/listings/${listingId}/edit`, 'No path provided'))

	const supabase = createClient()

	const { error } = await supabase.storage.from('listings').remove([path])
	if (error) redirect(getErrorRedirect(`/listings/${listingId}/edit`, error.message))

	redirect(getSuccessRedirect(`/listings/${listingId}/edit`, 'Image deleted'))
}
