'use client'

import { createClient } from '@/utils/supabase/server'
import { Loader2Icon, UploadIcon, XIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import OpenAI from 'openai'
import { ChangeEvent, useState } from 'react'

export default function UploadImagesForm({
	listingId,
	signedUrls,
}: {
	listingId: string
	signedUrls: { path: string | null; signedUrl: string }[]
}) {
	const router = useRouter()
	const [isLoading, setIsLoading] = useState(false)
	const [images, setImages] = useState<{ path: string; signedUrl: string }[]>([])

	async function uploadImages(event: ChangeEvent<HTMLInputElement>) {
		setIsLoading(true)

		const files = event.target.files
		if (!files || files.length === 0) return

		const supabase = createClient()

		for (let i = 0; i < files.length; i++) {
			const file = files[i]
			const fileExt = file.name.split('.').pop()
			const filePath = `${listingId}/${new Date().getTime()}-${Math.random()}.${fileExt}`

			const { error: uploadFileError } = await supabase.storage.from('listings').upload(filePath, file)
			if (uploadFileError) throw uploadFileError.message

			const { data, error: signedUrlError } = await supabase.storage.from('listings').createSignedUrl(filePath, 60 * 60)
			if (signedUrlError || !data?.signedUrl) throw signedUrlError?.message ?? new Error('Failed to create signed url')

			setImages((p) => [...p, { path: filePath, signedUrl: data.signedUrl }])
		}

		setIsLoading(false)
	}

	async function deleteImage(path: string | null) {
		if (!path) return

		const supabase = createClient()
		await supabase.storage.from('listings').remove([path])

		router.refresh()
	}

	return (
		<div className='flex space-x-4 flex-wrap items-center'>
			{signedUrls.map((url) => (
				<div className='relative group' key={url.signedUrl}>
					{/* TODO: Delete confirmation */}
					<img className='group-hover:opacity-30 h-40 rounded-lg' src={url.signedUrl} />
					<div
						className='text-red-500 hidden group-hover:flex items-center justify-center absolute top-0 w-full h-full left-0 bg-primary/5 cursor-pointer'
						onClick={() => deleteImage(url.path)}>
						<XIcon className='w-5 h-5 mr-2' />
						Delete
					</div>
				</div>
			))}
			{images.map((image) => (
				<img key={image.signedUrl} className='h-40 rounded-lg' src={image.signedUrl} />
			))}
			{isLoading ? (
				<label className='animate-pulse bg-primary/10 border border-primary font-medium text-sm border-dashed h-40 w-40 rounded-lg flex items-center justify-center cursor-not-allowed'>
					<Loader2Icon className='w-6 h-6 animate-spin' />
				</label>
			) : (
				<label
					className='cursor-pointer border border-primary font-medium text-sm border-dashed h-40 w-40 rounded-lg flex items-center justify-center hover:bg-primary/5'
					htmlFor='image-upload'>
					<UploadIcon className='w-4 h-4 mr-1' />
					Upload
					<input className='sr-only' id='image-upload' name='image-upload' type='file' multiple onChange={uploadImages} />
				</label>
			)}
		</div>
	)
}
