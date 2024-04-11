'use client'

import { createClient } from '@/utils/supabase/server'
import { Loader2Icon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import OpenAI from 'openai'
import { useState } from 'react'
import { Input } from './ui/input'

export default function NewUploadForm() {
	const router = useRouter()
	const [isLoading, setIsLoading] = useState(false)

	async function upload(files: FileList | null) {
		if (!files || files.length === 0) return

		setIsLoading(true)

		try {
			const supabase = createClient()

			const file = files[0]
			const fileExt = file.name.split('.').pop()
			const filePath = `${new Date().getTime()}-${Math.random()}.${fileExt}`

			const { error: uploadFileError } = await supabase.storage.from('listings').upload(filePath, file)
			if (uploadFileError) throw uploadFileError.message

			const { data, error: signedUrlError } = await supabase.storage.from('listings').createSignedUrl(filePath, 60 * 60)
			if (signedUrlError || !data?.signedUrl) throw signedUrlError?.message ?? new Error('Failed to create signed url')
			const signedUrl = data.signedUrl.replace('http://127.0.0.1:54321', process.env.NEXT_PUBLIC_NGROK_URL ?? '')

			const { data: rules } = await supabase.from('rules').select()
			const rulesText = rules?.map((rule) => rule.rule).join('; ') ?? ''
			console.log('rulesText', rulesText)

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

			router.refresh()
		} catch (error) {
			throw error
		} finally {
			setIsLoading(false)
		}
	}

	return (
		<div className='flex space-x-2 items-center'>
			<Input className='sm:w-fit' disabled={isLoading} type='file' onChange={(event) => upload(event.target.files)} />
			{isLoading && <Loader2Icon className='w-6 h-6 animate-spin' />}
		</div>
	)
}
