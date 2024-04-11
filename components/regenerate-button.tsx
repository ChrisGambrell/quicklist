'use client'

import { createClient } from '@/utils/supabase/server'
import { useRouter } from 'next/navigation'
import OpenAI from 'openai'
import { useState } from 'react'
import { Button } from './ui/button'

export default function RegenerateButton({ listingId, urls }: { listingId: string; urls: string[] }) {
	const router = useRouter()
	const [isLoading, setIsLoading] = useState(false)

	async function regenerate() {
		if (urls.length === 0) return

		setIsLoading(true)

		try {
			const supabase = createClient()

			const { data: rules } = await supabase.from('rules').select()
			const rulesText = rules?.map((rule) => rule.rule).join('; ') ?? ''

			const openai = new OpenAI({ apiKey: process.env.NEXT_PUBLIC_OPENAI_KEY, dangerouslyAllowBrowser: true })
			const res = await openai.chat.completions.create({
				model: 'gpt-4-vision-preview',
				messages: [
					{
						role: 'user',
						content: [
							{
								type: 'text',
								text: `Describe this item for an Ebay listing in the following format: \'{"title": "[title]", "description": "[description]", "price": [price]}\'" with these rules: ${rulesText}`,
							},
							...urls.map(
								(url) =>
									({
										type: 'image_url',
										image_url: { url: url.replace('http://127.0.0.1:54321', process.env.NEXT_PUBLIC_NGROK_URL ?? '') },
									} as OpenAI.Chat.Completions.ChatCompletionContentPart)
							),
						],
					},
				],
			})

			console.log('response', res.choices)

			const json = JSON.parse(`{${res.choices[0].message.content?.replace(/.*{/s, '').replace(/}.*/s, '').trim()}}`)

			const { error: upsertError } = await supabase
				.from('listings')
				.upsert({
					id: listingId,
					title: json.title?.trim() ?? null,
					description: json.description?.trim() ?? null,
					price: json.price ?? null,
				})
				.single()
			if (upsertError) throw upsertError.message

			router.refresh()
		} catch (error) {
			throw error
		} finally {
			setIsLoading(false)
		}
	}

	return (
		<Button disabled={isLoading} variant='secondary' onClick={regenerate}>
			Regenerate from images
		</Button>
	)
}
