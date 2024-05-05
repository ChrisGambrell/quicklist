// @ts-nocheck

// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import { createClient } from 'npm:@supabase/supabase-js'
import OpenAI from 'npm:openai'

export const getImageUrl = (path: ListingImage['image_path']) => path.replace('http://kong:8000', Deno.env.get('NGROK_URL') ?? '')

export const requiredCredits = (num: number) => {
	if (num === 0) return 0
	if (num < 3) return 1
	return Math.round(num / 3)
}

Deno.serve(async (req) => {
	const { listingId } = await req.json()
	if (!listingId) return Response.json({ error: 'No listingId provided' }, { status: 400 })

	const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!, {
		global: { headers: { Authorization: req.headers.get('Authorization')! } },
	})

	const { data: listing, error } = await supabase.from('listings').select('*, images:listing_images(*)').eq('id', listingId).maybeSingle()
	if (error || !listing) return Response.json({ error: error?.message || 'No listing found' }, { status: error ? 500 : 404 })

	const { data: images } = await supabase.storage.from('listing_images').createSignedUrls(
		listing.images.map(({ image_path }) => image_path),
		60 * 60
	)
	if (!images || images.length === 0) return Response.json({ error: 'No images found' }, { status: 404 })

	const credits_to_use = requiredCredits(images.length)
	const { error: canGenerateError } = await supabase.rpc('can_generate', { credits_to_use })
	if (canGenerateError) return Response.json({ error: canGenerateError.message }, { status: 500 })

	const { data: rules, error: rulesError } = await supabase.from('rules').select().eq('user_id', listing.user_id)
	if (rulesError) return Response.json({ error: rulesError.message }, { status: 500 })
	const rulesText = rules.map(({ rule }) => rule).join('; ')

	const openai = new OpenAI({ apiKey: Deno.env.get('OPENAI_KEY')! })
	const messages = images.map(
		({ signedUrl }) =>
			({ type: 'image_url', image_url: { url: getImageUrl(signedUrl) } } as OpenAI.Chat.Completions.ChatCompletionContentPart)
	)
	const format = `{"title": "[title:string]", "description": "[description:string]", "price": [price:float]}`

	const res = await openai.chat.completions.create({
		model: 'gpt-4-vision-preview',
		messages: [
			{
				role: 'user',
				content: [
					{
						type: 'text',
						text: `[no prose]\n[returns json]\nDescribe this item for an online marketplace listing in the following format: \'${format}\'" with these rules: '${rulesText}'`,
					},
					...messages,
				],
			},
		],
	})

	if (res.choices.length === 0 || !res.choices[0].message.content)
		return Response.json({ error: 'No response from OpenAI' }, { status: 500 })

	console.log(`{${res.choices[0].message.content.replace(/.*{/s, '').replace(/}.*/s, '').trim()}}`)
	const resJson = JSON.parse(`{${res.choices[0].message.content.replace(/.*{/s, '').replace(/}.*/s, '').trim()}}`)
	const { title, description, price } = resJson

	const { error: insertGenerationError } = await supabase
		.from('generations')
		.insert({ listing_id: listingId, user_id: listing.user_id, credits: credits_to_use, data: resJson })
	if (insertGenerationError) return Response.json({ error: insertGenerationError.message }, { status: 500 })

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
