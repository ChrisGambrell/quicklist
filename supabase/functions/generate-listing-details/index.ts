// @ts-nocheck

// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import { createClient } from 'npm:@supabase/supabase-js'
import OpenAI from 'npm:openai'

const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!)

Deno.serve(async (req) => {
	const { listingId } = await req.json()
	if (!listingId) return Response.json({ error: 'No listingId provided' }, { status: 400 })

	const { data: listing, error } = await supabase.from('listings').select().eq('id', listingId).maybeSingle()
	if (error || !listing) return Response.json({ error: error?.message || 'No listing found' }, { status: error ? 500 : 404 })

	const { data: files } = await supabase.storage.from('listings').list(listingId)
	if (!files) return Response.json({ error: 'No images found' }, { status: 404 })

	const { data: images } = await supabase.storage.from('listings').createSignedUrls(
		files.map((file) => `${listingId}/${file.name}`),
		60 * 60 * 24
	)
	if (!images || images.length === 0) return Response.json({ error: 'No images found' }, { status: 404 })

	const { data: rules, error: rulesError } = await supabase.from('rules').select().eq('user_id', listing.user_id)
	if (rulesError) return Response.json({ error: rulesError.message }, { status: 500 })
	const rulesText = rules.map(({ rule }) => rule).join('; ')

	const openai = new OpenAI({ apiKey: Deno.env.get('OPENAI_KEY')! })

	// TODO: Need to have .env be pointed to .env.local so that it can use NGROK_URL and OPENAI_KEY
	const urls = images.map((image) => image.signedUrl.replace('http://kong:8000', 'https://3583-174-102-5-87.ngrok-free.app'))
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
		return Response.json({ error: 'No response from OpenAI' }, { status: 500 })

	const resJson = JSON.parse(`{${res.choices[0].message.content.replace(/.*{/s, '').replace(/}.*/s, '').trim()}}`)
	const { title, description, price } = resJson

	const { data: updatedListing, error: updateError } = await supabase
		.from('listings')
		.update({
			title: title?.trim() ?? null,
			description: description?.trim() ?? null,
			price: price ?? null,
		})
		.eq('id', listingId)
		.select()
	if (updateError) return Response.json({ error: updateError.message }, { status: 500 })

	return Response.json({ listing: updatedListing })
})
