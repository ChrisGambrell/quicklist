import { Tables } from '@/db_types'
import OpenAI from 'openai'
import { createClient } from './supabase/server'

export async function getListingImages(listingId: Tables<'listings'>['id']) {
	const supabase = createClient()

	const { data: files } = await supabase.storage.from('listings').list(listingId)
	if (!files) return null

	const { data } = await supabase.storage.from('listings').createSignedUrls(
		files.map((file) => `${listingId}/${file.name}`),
		60 * 60 * 24
	)
	if (!data) return null

	return data
}

export async function generateListingData(listingId: Tables<'listings'>['id']) {
	const images = await getListingImages(listingId)

	if (!images || images.length === 0) return null
	const supabase = createClient()

	const { data: rules } = await supabase.from('rules').select()
	if (!rules) return null
	const rulesText = rules.map(({ rule }) => rule).join('; ')

	const openai = new OpenAI({ apiKey: process.env.NEXT_PUBLIC_OPENAI_KEY, dangerouslyAllowBrowser: true })

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
	if (res.choices.length === 0 || !res.choices[0].message.content) return null

	const resJson = JSON.parse(`{${res.choices[0].message.content.replace(/.*{/s, '').replace(/}.*/s, '').trim()}}`)
	const { title, description, price } = resJson

	const { error: upsertError } = await supabase
		.from('listings')
		.upsert({ id: listingId, title: title?.trim() ?? null, description: description?.trim() ?? null, price: price ?? null })
	if (upsertError) return null
}
