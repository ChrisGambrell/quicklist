'use server'

import { env } from '@/env'
import { getAuth } from '@/utils/_helpers'
import { createClient } from '@/utils/supabase/server'
import { Listing, ListingImage } from '@/utils/types'
import { updateListingSchema } from '@/validators/listing'
import { getErrorRedirect, getSuccessRedirect, parseFormData } from '@cgambrell/utils'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { OpenAI } from 'openai'

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

	const { data: listing, error } = await supabase.from('listings').select('*, images:listing_images(*)').eq('id', listingId).maybeSingle()
	if (error || !listing) redirect(getErrorRedirect(`/listings/${listingId}/edit`, error?.message || 'No listing found'))

	const { data: images } = await supabase.storage.from('listing_images').createSignedUrls(
		listing.images.map(({ image_path }) => image_path),
		60 * 60
	)
	if (!images || images.length === 0) redirect(getErrorRedirect(`/listings/${listingId}/edit`, 'No images found'))

	let credits_to_use
	if (images.length === 0) credits_to_use = 0
	else if (images.length < 3) credits_to_use = 1
	else credits_to_use = Math.round(images.length / 3)

	const { error: canGenerateError } = await supabase.rpc('can_generate', { credits_to_use })
	if (canGenerateError) redirect(getErrorRedirect('/pricing', canGenerateError.message))

	// BUG: Listing.user_id shouldn't be null
	const { data: rules, error: rulesError } = await supabase
		.from('rules')
		.select()
		.eq('user_id', listing.user_id ?? '')
	if (rulesError) redirect(getErrorRedirect(`/listings/${listingId}/edit`, rulesError.message))
	const rulesText = rules.map(({ rule }) => rule).join('; ')

	const openai = new OpenAI({ apiKey: env.OPENAI_KEY })
	const messages = images.map(
		({ signedUrl }) =>
			({
				type: 'image_url',
				image_url: { url: signedUrl.replace('http://127.0.0.1:54321', env.NEXT_PUBLIC_NGROK_URL ?? '') },
			} as OpenAI.Chat.Completions.ChatCompletionContentPart)
	)
	const format = `{"title": "[title:string]", "description": "[description:string]", "price": [price:float]}`

	const res = await openai.chat.completions.create({
		model: 'gpt-4o-2024-05-13',
		messages: [
			{
				role: 'user',
				content: [
					{
						type: 'text',
						text: `[no prose]\n[output only json]\nDescribe this item for an online marketplace listing in the following format: \'${format}\'" with these rules: '${rulesText}'`,
					},
					...messages,
				],
			},
		],
	})

	if (res.choices.length === 0 || !res.choices[0].message.content)
		redirect(getErrorRedirect(`/listings/${listingId}/edit`, 'No response from OpenAI'))

	try {
		// BUG: ts-ignore
		// @ts-ignore
		const resJson = JSON.parse(`{${res.choices[0].message.content.replace(/.*{/s, '').replace(/}.*/s, '').trim()}}`)
		const { title, description, price } = resJson

		const { error: insertGenerationError } = await supabase
			.from('generations')
			.insert({ listing_id: listingId, user_id: listing.user_id ?? '', credits: credits_to_use, data: resJson })
		if (insertGenerationError) redirect(getErrorRedirect(`/listings/${listingId}/edit`, insertGenerationError.message))

		// BUG: Listing.user_id shouldn't be null
		const { error: updateError } = await supabase
			.from('listings')
			.update({
				title: title?.trim() ?? null,
				description: description?.trim() ?? null,
				price: price ?? null,
			})
			.eq('id', listingId)
			.select()
		if (updateError) redirect(getErrorRedirect(`/listings/${listingId}/edit`, updateError.message))

		revalidatePath(`/listings/${listingId}/edit`, 'page')
		redirect(getSuccessRedirect(`/listings/${listingId}/edit`, 'Listing data generated'))
	} catch (error) {
		if (error instanceof SyntaxError) redirect(getErrorRedirect(`/listings/${listingId}/edit`, res.choices[0].message.content))
		redirect(getErrorRedirect(`/listings/${listingId}/edit`, error instanceof Error ? error.message : 'An unexpected error occurred'))
	}
}

export async function deleteImage({ listingId, path }: { listingId: Listing['id']; path: ListingImage['image_path'] }) {
	const supabase = createClient()

	const { error } = await supabase.storage.from('listing_images').remove([path])
	if (error) redirect(getErrorRedirect(`/listings/${listingId}/edit`, error.message))

	revalidatePath(`/listings/${listingId}/edit`, 'page')
	redirect(getSuccessRedirect(`/listings/${listingId}/edit`, 'Image deleted'))
}
