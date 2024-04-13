'use client'

import { createImages, deleteImage } from '@/actions/listing'
import ActionButton from '@/components/action-button'
import { useErrorToaster } from '@/components/form'
import { Label } from '@/components/ui/label'
import { getListingImages } from '@/utils/helpers/server'
import { Loader2Icon, UploadIcon, XIcon } from 'lucide-react'
import { useFormState } from 'react-dom'

export default function ListingImages({ images, listingId }: { images: Awaited<ReturnType<typeof getListingImages>>; listingId: string }) {
	const useCreateImages = createImages.bind(null, listingId)
	const [state, action, pending] = useFormState(useCreateImages, null)
	useErrorToaster(state?.errors?._global)

	return (
		<form className='grid gap-8' action={action}>
			<div className='grid gap-2'>
				<Label htmlFor='image'>Images</Label>
				<div className='flex space-x-4 flex-wrap items-center'>
					{images?.map((image) => (
						<div className='relative group' key={image.signedUrl}>
							{/* TODO: Delete confirmation */}
							<img className='group-hover:opacity-30 h-40 rounded-lg' src={image.signedUrl} />
							<div
								className='text-red-500 hidden group-hover:flex items-center justify-center absolute top-0 w-full h-full left-0 bg-primary/5 cursor-pointer'
								onClick={() => deleteImage(image.path)}>
								<XIcon className='w-5 h-5 mr-2' />
								Delete
							</div>
						</div>
					))}
					{/* FIXME: Show images on standby to upload */}
					{pending ? (
						<label className='animate-pulse bg-primary/10 border border-primary font-medium text-sm border-dashed h-40 w-40 rounded-lg flex items-center justify-center cursor-not-allowed'>
							<Loader2Icon className='w-6 h-6 animate-spin' />
						</label>
					) : (
						<label
							className='cursor-pointer border border-primary font-medium text-sm border-dashed h-40 w-40 rounded-lg flex items-center justify-center hover:bg-primary/5'
							htmlFor='images'>
							<UploadIcon className='w-4 h-4 mr-1' />
							Upload
							<input className='sr-only' id='images' name='images' type='file' multiple />
						</label>
					)}
				</div>
			</div>
			<div>
				<ActionButton>Add images</ActionButton>
			</div>
		</form>
	)
}
