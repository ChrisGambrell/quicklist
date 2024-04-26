'use client'

import { deleteImage, deleteListing, updateListing } from '@/actions/listing'
import ActionButton from '@/components/action-button'
import BackButton from '@/components/back-button'
import { FormError, useErrorToaster } from '@/components/form'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Tables } from '@/db_types'
import { cn } from '@/lib/utils'
import { PLACEHOLDER_IMAGE } from '@/utils/constants'
import { SignedImage } from '@/utils/types'
import { UploadIcon } from 'lucide-react'
import { useFormState } from 'react-dom'
import UploadImages from './upload-images'

const placeholder = {
	title: "Classic Navy and White Checkered Men's Long Sleeve Shirt",
	price: '12.49',
	description: 'Enhance your wardrobe with this timeless navy and white checkered long sleeve shirt...',
}

export default function EditListingClient({ images, listing }: { images: SignedImage[] | null; listing: Tables<'listings'> }) {
	const useUpdateListing = updateListing.bind(null, listing.id)
	const [updateState, updateAction] = useFormState(useUpdateListing, null)
	useErrorToaster(updateState?.errors?._global)

	const useDeleteListing = deleteListing.bind(null, listing.id)
	const [deleteState, deleteAction] = useFormState(useDeleteListing, null)
	useErrorToaster(deleteState?.errors?._global)

	return (
		<form className='mx-auto grid max-w-[59rem] flex-1 auto-rows-max gap-4 w-full'>
			<div className='flex items-center gap-4 overflow-hidden'>
				<div className='flex-shrink-0'>
					<BackButton />
				</div>

				<h1 className='flex-1 whitespace-nowrap text-xl font-semibold tracking-tight truncate'>{listing.title}</h1>

				<div className='hidden items-center gap-2 md:ml-auto md:flex flex-shrink-0'>
					<Button variant='outline' size='sm' type='reset'>
						Discard
					</Button>
					<ActionButton formAction={updateAction} size='sm'>
						Save Listing
					</ActionButton>
				</div>
			</div>
			<div className='grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3'>
				<div className='grid auto-rows-max items-start gap-4 lg:col-span-2'>
					<Card>
						<CardHeader>
							<CardTitle>Listing Details</CardTitle>
						</CardHeader>
						<CardContent>
							<div className='grid gap-6'>
								<div className='grid gap-3'>
									<Label htmlFor='title'>Title</Label>
									<Input id='title' name='title' placeholder={placeholder.title} defaultValue={listing.title ?? ''} />
									<FormError errors={updateState?.errors} id='title' />
								</div>
								<div className='grid gap-3'>
									<Label htmlFor='price'>Price</Label>
									<Input id='price' name='price' placeholder={placeholder.price} defaultValue={listing.price ?? ''} />
									<FormError errors={updateState?.errors} id='price' />
								</div>
								<div className='grid gap-3'>
									<Label htmlFor='description'>Description</Label>
									<Textarea
										id='description'
										name='description'
										placeholder={placeholder.description}
										defaultValue={listing.description ?? ''}
										className='min-h-32'
									/>
									<FormError errors={updateState?.errors} id='description' />
								</div>
							</div>
						</CardContent>
					</Card>
				</div>
				<div className='grid auto-rows-max items-start gap-4'>
					<Card className='overflow-hidden' x-chunk='dashboard-07-chunk-4'>
						<CardHeader>
							<CardTitle>Product Images</CardTitle>
							<CardDescription>Click on an image to remove it.</CardDescription>
						</CardHeader>
						<CardContent>
							<div className='grid gap-2'>
								<ListingImage image={images?.[0]} variant='primary' />
								<div className='grid grid-cols-3 gap-2'>
									{images &&
										images.map((image) => <ListingImage key={image.signedUrl} image={image} variant='secondary' />)}
									{/* TODO: Upload image */}
									<UploadImages listingId={listing.id} />
								</div>
							</div>
						</CardContent>
					</Card>

					{/* TODO: Generate listing data */}
					<Card>
						<CardHeader>
							<CardTitle>Generate Listing Data</CardTitle>
							<CardDescription>Generate the listing&apos;s data based on its details and images.</CardDescription>
						</CardHeader>
						<CardContent>
							<ActionButton className='w-full' formAction={deleteAction} size='sm' variant='secondary'>
								Generate
							</ActionButton>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle>Delete Listing</CardTitle>
							<CardDescription>This cannot be reversed.</CardDescription>
						</CardHeader>
						<CardContent>
							<ActionButton className='w-full' formAction={deleteAction} size='sm' variant='destructive'>
								Delete Listing
							</ActionButton>
						</CardContent>
					</Card>
				</div>
			</div>
			<div className='flex items-center justify-center gap-2 md:hidden'>
				<Button variant='outline' size='sm' type='reset'>
					Discard
				</Button>
				<ActionButton formAction={updateAction} size='sm'>
					Save Listing
				</ActionButton>
			</div>
		</form>
	)
}

function ListingImage({ image, variant }: { image?: SignedImage; variant: 'primary' | 'secondary' }) {
	const useDeleteImage = deleteImage.bind(null, image?.path ?? null)

	const sizeMap: Record<'primary' | 'secondary', number> = {
		primary: 84,
		secondary: 300,
	}

	return (
		// {/* // TODO: Replace with Image component */}
		<button formAction={useDeleteImage}>
			<img
				className={cn('aspect-square w-full rounded-md object-cover', { 'cursor-pointer': variant === 'secondary' })}
				src={image?.signedUrl ?? PLACEHOLDER_IMAGE}
				alt='Listing image'
				height={sizeMap[variant]}
				width={sizeMap[variant]}
			/>
		</button>
	)
}
