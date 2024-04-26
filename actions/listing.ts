'use server'

import { getAuth, getListingImages } from '@/utils/helpers'
import { createClient } from '@/utils/supabase/server'
import { ActionReturn } from '@/utils/types'
import { revalidatePath } from 'next/cache'
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
const createImagesSchema = z.object({ images: z.instanceof(File).array().nonempty() })

export async function createListing() {
	const { auth, supabase } = await getAuth()

	const { data, error } = await supabase.from('listings').insert({ user_id: auth.id }).select().single()
	if (error || !data) return { errors: { _global: [error?.message ?? 'An unexpected error occurred'] } }

	redirect(`/listings/${data.id}/edit`)
}

export async function updateListing(
	listingId: string,
	prevState: any,
	formData: FormData
): Promise<ActionReturn<typeof updateListingSchema>> {
	const data = Object.fromEntries(formData)

	const parsed = updateListingSchema.safeParse(data)
	if (!parsed.success) return { errors: parsed.error.flatten().fieldErrors }

	const supabase = createClient()

	const { error } = await supabase.from('listings').update(parsed.data).eq('id', listingId)
	if (error) return { errors: { _global: [error.message] } }

	revalidatePath('/listings', 'layout')
}

export async function deleteListing(listingId: string): Promise<ActionReturn<undefined>> {
	const supabase = createClient()

	const { error } = await supabase.from('listings').delete().eq('id', listingId)
	if (error) return { errors: { _global: [error.message] } }

	redirect('/listings')
}

export async function generateListingData(listingId: string): Promise<ActionReturn<undefined>> {
	const supabase = createClient()

	const { data: listing, error: listingError } = await supabase.from('listings').select().eq('id', listingId).maybeSingle()
	if (listingError || !listing) return { errors: { _global: [listingError?.message ?? 'Listing not found'] } }

	const images = await getListingImages({ listingId: listing.id })
	if (!images || images.length === 0) return { errors: { _global: ['No images found'] } }

	const { data: rules, error: rulesError } = await supabase.from('rules').select()
	if (rulesError) return { errors: { _global: [rulesError.message] } }
	const rulesText = rules.map(({ rule }) => rule).join('; ')

	const openai = new OpenAI({ apiKey: process.env.NEXT_PUBLIC_OPENAI_KEY })

	const urls = images.map((image) => image.signedUrl.replace('http://127.0.0.1:54321', process.env.NEXT_PUBLIC_NGROK_URL ?? ''))
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
	if (res.choices.length === 0 || !res.choices[0].message.content) return { errors: { _global: ['No response from OpenAI'] } }

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
	if (updateError) return { errors: { _global: [updateError.message] } }

	revalidatePath('/listings', 'layout')
	return { successTrigger: true }
}

export async function createImages(
	listingId: string,
	prevState: any,
	formData: FormData
): Promise<ActionReturn<typeof createImagesSchema>> {
	const files = formData.getAll('images')

	const parsed = createImagesSchema.safeParse({ images: files })
	if (!parsed.success) return { errors: parsed.error.flatten().fieldErrors }

	if (parsed.data.images.length === 1 && parsed.data.images[0].size === 0) return { errors: { _global: ['No images provided'] } }

	// FIXME: Check to see if I need to validate owner of listing before uploading images
	const { supabase } = await getAuth()

	parsed.data.images.forEach(async (file) => {
		const fileExt = file.name.split('.').pop()
		const filePath = `${listingId}/${new Date().getTime()}-${Math.random()}.${fileExt}`

		const { error } = await supabase.storage.from('listings').upload(filePath, file)
		if (error) return { errors: { _global: [error.message] } }
	})

	revalidatePath('/listings', 'layout')
}

export async function deleteImage(path: string | null) {
	if (!path) return { errors: { _global: ['No path provided'] } }

	const supabase = createClient()

	const { error } = await supabase.storage.from('listings').remove([path])
	if (error) return { errors: { _global: [error.message] } }

	revalidatePath('/listings', 'layout')
}
