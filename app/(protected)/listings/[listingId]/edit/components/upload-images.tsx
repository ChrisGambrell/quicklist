'use client'

import { Listing } from '@prisma/client'
import { Loader2Icon, UploadIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function UploadImages({ listingId }: { listingId: Listing['id'] }) {
	const router = useRouter()
	const [pending, setPending] = useState(false)

	// async function uploadImages(event: ChangeEvent<HTMLInputElement>) {
	// 	setPending(true)

	// 	try {
	// 		const files = event.target.files
	// 		if (!files || files.length === 0) throw 'No files selected'

	// 		const supabase = createClient()

	// 		for (let i = 0; i < files.length; i++) {
	// 			const file = files[i]
	// 			const fileExt = file.name.split('.').pop()
	// 			const filePath = `${listingId}/${new Date().getTime()}-${Math.random()}.${fileExt}`

	// 			const { error } = await supabase.storage.from('listing_images').upload(filePath, file)
	// 			if (error) throw error.message
	// 		}
	// 	} catch (error: any) {
	// 		toast.error(error)
	// 	} finally {
	// 		setPending(false)
	// 		router.refresh()
	// 	}
	// }

	return (
		<label
			className='cursor-pointer flex aspect-square w-full items-center justify-center rounded-md border border-dashed'
			htmlFor='images'>
			{pending ? (
				<Loader2Icon className='h-4 w-4 text-muted-foreground animate-spin' />
			) : (
				<UploadIcon className='h-4 w-4 text-muted-foreground' />
			)}
			<span className='sr-only'>{pending ? 'Uploading' : 'Upload'}</span>
			{/* <input className='sr-only' disabled={pending} id='images' type='file' accept='image/*' multiple onChange={uploadImages} /> */}
			{/* TODO: Upload images */}
			<input className='sr-only' disabled={pending} id='images' type='file' accept='image/*' multiple />
		</label>
	)
}
