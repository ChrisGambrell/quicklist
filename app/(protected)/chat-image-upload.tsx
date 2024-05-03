'use client'

import { generateListingData } from '@/actions/listing'
import { Button } from '@/components/ui/button'
import { requiredCredits } from '@/utils/helpers'
import { createClient } from '@/utils/supabase/client'
import { Loader2Icon, UploadIcon } from 'lucide-react'
import Image from 'next/image'
import { ChangeEvent, FormEvent, useState } from 'react'
import toast from 'react-hot-toast'

export default function ChatImageUpload() {
	const [images, setImages] = useState<File[]>([])
	const [isLoading, setIsLoading] = useState(false)

	function onUpload(event: ChangeEvent<HTMLInputElement>) {
		const files = event.target.files
		if (!files || files.length === 0) return
		setImages(Array.from(files))
	}

	async function upload(event: FormEvent) {
		event.preventDefault()

		setIsLoading(true)
		if (!images.length) return setIsLoading(false)

		const supabase = createClient()

		const {
			data: { user },
		} = await supabase.auth.getUser()
		if (!user) return toast.error('User not found')

		const { data: listing, error: createListingError } = await supabase.from('listings').insert({ user_id: user.id }).select().single()
		if (createListingError || !listing) {
			setIsLoading(false)
			return toast.error(createListingError?.message ?? 'An unexpected error occurred')
		}

		for (let i = 0; i < images.length; i++) {
			const file = images[i]
			const fileExt = file.name.split('.').pop()
			const filePath = `${listing.id}/${new Date().getTime()}-${Math.random()}.${fileExt}`

			const { error } = await supabase.storage.from('listing_images').upload(filePath, file)
			if (error) {
				setIsLoading(false)
				return toast.error(error.message)
			}
		}

		await generateListingData({ listingId: listing.id })
		setIsLoading(false)
	}

	return (
		<form className='grid gap-4' onSubmit={upload}>
			{images.length > 0 && (
				<div className='grid gap-2'>
					<Image
						src={URL.createObjectURL(images[0])}
						alt='Listing image'
						className='aspect-square w-full rounded-md object-cover'
						height={300}
						width={300}
					/>

					<div className='grid grid-cols-3 gap-2'>
						{images.length > 1 &&
							images
								.slice(1)
								.map((image) => (
									<Image
										key={image.name}
										src={URL.createObjectURL(image)}
										alt='Listing image'
										className='aspect-square w-full rounded-md object-cover'
										height={84}
										width={84}
									/>
								))}

						<label
							className='cursor-pointer flex aspect-square w-full items-center justify-center rounded-md border border-dashed'
							htmlFor='images'>
							<UploadIcon className='h-4 w-4 text-muted-foreground' />
							<span className='sr-only'>Upload</span>
							<input className='sr-only' disabled={isLoading} id='images' type='file' multiple onChange={onUpload} />
						</label>
					</div>
				</div>
			)}

			{images.length === 0 && (
				<label
					className='cursor-pointer flex aspect-square w-full items-center justify-center rounded-md border border-dashed'
					htmlFor='images'>
					<UploadIcon className='h-4 w-4 text-muted-foreground' />
					<span className='sr-only'>Upload</span>
					<input className='sr-only' disabled={isLoading} id='images' type='file' multiple onChange={onUpload} />
				</label>
			)}

			<Button className='w-full' disabled={images.length === 0 || isLoading}>
				{isLoading && <Loader2Icon className='w-5 h-5 animate-spin mr-2' />}
				<span>
					Generate
					{images.length ? ` (${requiredCredits(images.length)} credit${requiredCredits(images.length) > 1 ? 's' : ''})` : ''}
				</span>
			</Button>
		</form>
	)
}
