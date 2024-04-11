'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import OpenAI from 'openai'

export async function uploadListing(formData: FormData) {
	const file = formData.get('file') as File | null | undefined
	if (!file || file.size === 0) throw new Error('No file provided')

	const supabase = createClient()

	const fileExt = file.name.split('.').pop()
	const filePath = `${new Date().getTime()}-${Math.random()}.${fileExt}`

	const { error: uploadFileError } = await supabase.storage.from('listings').upload(filePath, file)
	if (uploadFileError) throw uploadFileError.message

	const { data, error: signedUrlError } = await supabase.storage.from('listings').createSignedUrl(filePath, 60 * 60)
	if (signedUrlError || !data?.signedUrl) throw signedUrlError?.message ?? new Error('Failed to create signed url')
	const signedUrl = data.signedUrl.replace('http://127.0.0.1:54321', process.env.NGROK_URL ?? '')

	const openai = new OpenAI({ apiKey: process.env.OPENAI_KEY })
	const res = await openai.chat.completions.create({
		model: 'gpt-4-vision-preview',
		messages: [
			{
				role: 'user',
				content: [
					{
						type: 'text',
						text: 'Describe this item for an Ebay listing in the following format: \'{"title": "[title]", "description": "[description]", "price": [price]}\'"',
					},
					{ type: 'image_url', image_url: { url: signedUrl } },
				],
			},
		],
	})

	const json = JSON.parse(`{${res.choices[0].message.content?.replace(/.*{/s, '').replace(/}.*/s, '').trim()}}`)
	const { error } = await supabase.from('listings').insert({
		file_path: filePath,
		title: json.title?.trim() ?? null,
		description: json.description?.trim() ?? null,
		price: json.price ?? null,
	})
	if (error) throw error.message

	revalidatePath('/', 'layout')
}
