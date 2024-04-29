'use server'

import { Tables } from '@/db_types'
import { env } from '@/env'
import { getAuth, getListingImages } from '@/utils/_helpers'
import { getErrorRedirect, getSuccessRedirect, parseFormData } from '@/utils/helpers'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import OpenAI from 'openai'
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

export async function updateListing(listingId: Tables<'listings'>['id'], _prevState: any, formData: FormData) {
	const { data, errors } = parseFormData(formData, updateListingSchema)
	if (errors) return { errors }

	const supabase = createClient()

	const { error } = await supabase.from('listings').update(data).eq('id', listingId)
	if (error) redirect(getErrorRedirect(`/listings/${listingId}/edit`, error.message))

	redirect(getSuccessRedirect(`/listings/${listingId}/edit`, 'Listing updated'))
}

export async function deleteListing(listingId: Tables<'listings'>['id']) {
	const supabase = createClient()

	const { error } = await supabase.from('listings').delete().eq('id', listingId)
	if (error) redirect(getErrorRedirect(`/listings/${listingId}/edit`, error.message))

	redirect(getSuccessRedirect('/listings', 'Listing deleted'))
}

export async function generateListingData(listingId: Tables<'listings'>['id']) {
	const supabase = createClient()

	const { data: listing, error: listingError } = await supabase.from('listings').select().eq('id', listingId).maybeSingle()
	if (listingError || !listing) redirect(getErrorRedirect(`/listings/${listingId}/edit`, listingError?.message ?? 'Listing not found'))

	const images = await getListingImages({ listingId: listing.id })
	if (!images || images.length === 0) redirect(getErrorRedirect(`/listings/${listingId}/edit`, 'No images found'))

	const { data: rules, error: rulesError } = await supabase.from('rules').select()
	if (rulesError) redirect(getErrorRedirect(`/listings/${listingId}/edit`, rulesError.message))
	const rulesText = rules.map(({ rule }) => rule).join('; ')

	const openai = new OpenAI({ apiKey: env.OPENAI_KEY })

	const urls = images.map((image) => image.signedUrl.replace('http://127.0.0.1:54321', env.NEXT_PUBLIC_NGROK_URL ?? ''))
	const messages = urls.map((url) => ({ type: 'image_url', image_url: { url } } as OpenAI.Chat.Completions.ChatCompletionContentPart))

	const format = `{"title": "[title]", "description": "[description]", "price": [price]}`

	const res = await openai.chat.completions.create({
		model: 'gpt-4-vision-preview',
		messages: [
			{
				role: 'user',
				content: [
					{
						type: 'text',
						text: `Describe this item for an eBay listing in the following format: \'${format}\'" with these rules: '${rulesText}'`,
					},
					...messages,
				],
			},
		],
	})
	if (res.choices.length === 0 || !res.choices[0].message.content)
		redirect(getErrorRedirect(`/listings/${listingId}/edit`, 'No response from OpenAI'))

	try {
		const resJson = JSON.parse(`{${res.choices[0].message.content.replace(/.*{/s, '').replace(/}.*/s, '').trim()}}`)
		const { title, description, price } = resJson

		const { error: updateError } = await supabase
			.from('listings')
			.update({
				title: title?.trim() ?? null,
				description: description?.trim() ?? null,
				price: price ?? null,
			})
			.eq('id', listingId)
		if (updateError) redirect(getErrorRedirect(`/listings/${listingId}/edit`, updateError.message))

		// TODO: Title, price, anc description are not revalidating after generating
		redirect(getSuccessRedirect(`/listings/${listingId}/edit`, 'Listing data generated'))
	} catch (error) {
		redirect(getErrorRedirect(`/listings/${listingId}/edit`, 'Something went wrong. Please try again'))
	}
}

export async function deleteImage(listingId: Tables<'listings'>['id'], path: string | null) {
	if (!path) redirect(getErrorRedirect(`/listings/${listingId}/edit`, 'No path provided'))

	const supabase = createClient()

	const { error } = await supabase.storage.from('listings').remove([path])
	if (error) redirect(getErrorRedirect(`/listings/${listingId}/edit`, error.message))

	redirect(getSuccessRedirect(`/listings/${listingId}/edit`, 'Image deleted'))
}
