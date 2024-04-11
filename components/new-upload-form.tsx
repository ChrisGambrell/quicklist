'use client'

import { generateListingData } from '@/utils/helpers'
import { createClient } from '@/utils/supabase/server'
import { Loader2Icon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Button } from './ui/button'
import { Input } from './ui/input'

export default function NewUploadForm() {
	const router = useRouter()
	const [isLoading, setIsLoading] = useState(false)

	async function upload(files: FileList | null) {
		if (!files || files.length === 0) return

		setIsLoading(true)

		try {
			const supabase = createClient()

			const { data: listing } = await supabase.from('listings').insert({}).select().single()
			if (!listing) throw new Error('Failed to insert listing')

			const file = files[0]
			const fileExt = file.name.split('.').pop()
			const filePath = `${listing.id}/${new Date().getTime()}-${Math.random()}.${fileExt}`

			const { error: uploadFileError } = await supabase.storage.from('listings').upload(filePath, file)
			if (uploadFileError) throw uploadFileError.message

			await generateListingData(listing.id)
			router.push(`/listing/${listing.id}`)
		} catch (error) {
			throw error
		} finally {
			setIsLoading(false)
		}
	}

	async function newListing() {
		const supabase = createClient()
		const { data } = await supabase.from('listings').insert({}).select().single()
		if (data) router.push(`/listing/${data.id}`)
	}

	return (
		<div>
			<Button onClick={newListing}>Start a new listing</Button>
			<div className='mt-4'>Or upload a photo to auto-generate eBay fields:</div>
			<div className='flex items-center space-x-2'>
				<Input className='sm:w-fit' disabled={isLoading} type='file' onChange={(event) => upload(event.target.files)} />
				{isLoading && <Loader2Icon className='w-6 h-6 animate-spin' />}
			</div>
		</div>
	)
}
