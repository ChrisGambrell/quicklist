'use client'

import { deleteImage, deleteListing, generateListingData, updateListing } from '@/actions/listing'
import ActionButton from '@/components/action-button'
import BackButton from '@/components/back-button'
import CopyButton from '@/components/copy-button'
import { FormError } from '@/components/form-error'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Tables } from '@/db_types'
import { cn } from '@/lib/utils'
import { PLACEHOLDER_IMAGE } from '@/utils/constants'
import { SignedImage } from '@/utils/types'
import { CopyIcon } from 'lucide-react'
import Image from 'next/image'
import { useFormState } from 'react-dom'
import UploadImages from './upload-images'

const placeholder = {
	title: "Classic Navy and White Checkered Men's Long Sleeve Shirt",
	price: '12.49',
	description: 'Enhance your wardrobe with this timeless navy and white checkered long sleeve shirt...',
}

export default function EditListingClient({ images, listing }: { images: SignedImage[] | null; listing: Tables<'listings'> }) {
	const [state, action] = useFormState(updateListing.bind(null, { listingId: listing.id }), null)
	const useGenerateData = generateListingData.bind(null, { listingId: listing.id })
	const useDeleteListing = deleteListing.bind(null, { listingId: listing.id })

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
					<ActionButton formAction={action} size='sm'>
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
									<CopyButton value={listing.title ?? ''}>
										<Input id='title' name='title' placeholder={placeholder.title} defaultValue={listing.title ?? ''} />
									</CopyButton>
									<FormError value={state?.errors.title} />
								</div>
								<div className='grid gap-3'>
									<Label htmlFor='price'>Price</Label>
									<CopyButton value={listing.price?.toString() ?? ''}>
										<Input id='price' name='price' placeholder={placeholder.price} defaultValue={listing.price ?? ''} />
									</CopyButton>
									<FormError value={state?.errors.price} />
								</div>
								<div className='grid gap-3'>
									<Label htmlFor='description'>Description</Label>
									<CopyButton value={listing.description ?? ''}>
										<Textarea
											id='description'
											name='description'
											placeholder={placeholder.description}
											defaultValue={listing.description ?? ''}
											className='min-h-32'
										/>
									</CopyButton>
									<FormError value={state?.errors.description} />
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
								<ListingImage image={images?.[0]} listingId={listing.id} variant='primary' />
								<div className='grid grid-cols-3 gap-2'>
									{images &&
										images.map((image) => (
											<ListingImage key={image.signedUrl} image={image} listingId={listing.id} variant='secondary' />
										))}
									<UploadImages listingId={listing.id} />
								</div>
							</div>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle>Generate Listing Data</CardTitle>
							<CardDescription>Generate the listing&apos;s data based on its details and images.</CardDescription>
						</CardHeader>
						<CardContent>
							<ActionButton className='w-full' formAction={useGenerateData} size='sm' variant='secondary'>
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
							<ActionButton className='w-full' formAction={useDeleteListing} size='sm' variant='destructive'>
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
				<ActionButton formAction={action} size='sm'>
					Save Listing
				</ActionButton>
			</div>
		</form>
	)
}

function ListingImage({
	image,
	listingId,
	variant,
}: {
	image?: SignedImage
	listingId: Tables<'listings'>['id']
	variant: 'primary' | 'secondary'
}) {
	const useDeleteImage = deleteImage.bind(null, { listingId }, image?.path ?? null)

	const sizeMap: Record<'primary' | 'secondary', number> = {
		primary: 84,
		secondary: 300,
	}

	return (
		<button disabled={variant === 'primary' || !image} formAction={useDeleteImage}>
			<Image
				src={image?.signedUrl ?? PLACEHOLDER_IMAGE}
				alt='Listing image'
				className='aspect-square w-full rounded-md object-cover'
				height={sizeMap[variant]}
				width={sizeMap[variant]}
			/>
		</button>
	)
}
