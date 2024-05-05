'use client'

import { deleteImage, deleteListing, generateListingData, updateListing } from '@/actions/listing'
import ActionButton from '@/components/action-button'
import BackButton from '@/components/back-button'
import CopyButton from '@/components/copy-button'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Textarea } from '@/components/ui/textarea'
import { PLACEHOLDER_IMAGE } from '@/utils/constants'
import { getImageUrl, requiredCredits } from '@/utils/helpers'
import { ListingWithGenerationsAndImages, ListingImage as TListingImage } from '@/utils/types'
import { updateListingSchema } from '@/validators/listing'
import { zodResolver } from '@hookform/resolvers/zod'
import Image from 'next/image'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import UploadImages from './upload-images'

const placeholder = {
	title: "Classic Navy and White Checkered Men's Long Sleeve Shirt",
	price: '12.49',
	description: 'Enhance your wardrobe with this timeless navy and white checkered long sleeve shirt...',
}

export default function EditListingClient({ listing }: { listing: ListingWithGenerationsAndImages }) {
	const form = useForm<z.infer<typeof updateListingSchema>>({ defaultValues: { ...listing }, resolver: zodResolver(updateListingSchema) })

	const useUpdateListing = updateListing.bind(null, { listingId: listing.id })
	const useGenerateData = generateListingData.bind(null, { listingId: listing.id })
	const useDeleteListing = deleteListing.bind(null, { listingId: listing.id })

	useEffect(() => {
		form.reset({ ...listing })
	}, [form, listing])

	return (
		<Form {...form}>
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
						<ActionButton formAction={useUpdateListing} size='sm'>
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
									<FormField
										control={form.control}
										name='title'
										render={({ field }) => (
											<FormItem>
												<FormLabel>Title</FormLabel>
												<FormControl>
													<CopyButton value={field.value ?? ''}>
														<Input placeholder={placeholder.title} {...field} value={field.value ?? ''} />
													</CopyButton>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name='price'
										render={({ field }) => (
											<FormItem>
												<FormLabel>Price</FormLabel>
												<FormControl>
													<CopyButton value={field.value?.toString() ?? ''}>
														<Input placeholder={placeholder.price} {...field} value={field.value ?? ''} />
													</CopyButton>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name='description'
										render={({ field }) => (
											<FormItem>
												<FormLabel>Description</FormLabel>
												<FormControl>
													<CopyButton value={field.value ?? ''}>
														<Textarea
															placeholder={placeholder.description}
															className='min-h-32'
															{...field}
															value={field.value ?? ''}
														/>
													</CopyButton>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>
							</CardContent>
						</Card>

						<Card>
							<CardHeader>
								<div className='flex items-start justify-between'>
									<CardTitle>Generations</CardTitle>
								</div>
							</CardHeader>
							<CardContent>
								<Table>
									<TableHeader>
										<TableRow>
											<TableHead>Created at</TableHead>
											<TableHead>Credits used</TableHead>
										</TableRow>
									</TableHeader>
									<TableBody>
										{listing.generations.map((generation) => (
											<TableRow key={generation.id}>
												<TableCell>{new Date(generation.created_at).toDateString()}</TableCell>
												<TableCell>{generation.credits}</TableCell>
											</TableRow>
										))}
									</TableBody>
								</Table>
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
									{listing.images.length ? (
										<ListingImage image={listing.images[0]} variant='primary' />
									) : (
										<Image
											src={PLACEHOLDER_IMAGE}
											alt='Listing image'
											className='aspect-square w-full rounded-md object-cover'
											height={300}
											width={300}
										/>
									)}
									<div className='grid grid-cols-3 gap-2'>
										{listing.images.slice(1).map((image) => (
											<ListingImage key={image.id} image={image} variant='secondary' />
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
								<ActionButton
									className='w-full'
									disabled={!listing.images.length}
									formAction={useGenerateData}
									size='sm'
									variant='secondary'>
									Generate
									{listing.images.length
										? ` (${requiredCredits(listing.images.length)} credit${
												requiredCredits(listing.images.length) > 1 ? 's' : ''
										  })`
										: ''}
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
					<ActionButton formAction={useUpdateListing} size='sm'>
						Save Listing
					</ActionButton>
				</div>
			</form>
		</Form>
	)
}

// TODO:  delete overlay
function ListingImage({ image, variant }: { image: TListingImage; variant: 'primary' | 'secondary' }) {
	const useDeleteImage = deleteImage.bind(null, { listingId: image.listing_id, path: image.image_path })

	const sizeMap: Record<'primary' | 'secondary', number> = {
		primary: 84,
		secondary: 300,
	}

	return (
		<button formAction={useDeleteImage}>
			<Image
				src={getImageUrl(image.image_path)}
				alt='Listing image'
				className='aspect-square w-full rounded-md object-cover'
				height={sizeMap[variant]}
				width={sizeMap[variant]}
			/>
		</button>
	)
}
