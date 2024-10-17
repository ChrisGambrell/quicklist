'use client'

import { updateListing } from '@/actions/listing'
import { ActionButton } from '@/components/action-button'
import { CopyButton } from '@/components/copy-button'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { updateListingSchema } from '@/validators/listing'
import { zodResolver } from '@hookform/resolvers/zod'
import { Listing } from '@prisma/client'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const placeholder = {
	title: "Classic Navy and White Checkered Men's Long Sleeve Shirt",
	price: '12.49',
	description: 'Enhance your wardrobe with this timeless navy and white checkered long sleeve shirt...',
}

export function ListingForm({ canEdit, listing }: { canEdit: boolean; listing: Listing }) {
	const useUpdateListing = updateListing.bind(null, { listingId: listing.id })
	const form = useForm<z.infer<typeof updateListingSchema>>({ defaultValues: { ...listing }, resolver: zodResolver(updateListingSchema) })

	useEffect(() => {
		form.reset({ ...listing })
	}, [form, listing])

	return (
		<Form {...form}>
			<form action={useUpdateListing}>
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
					{canEdit && (
						<CardFooter>
							<div className='ml-auto flex gap-2'>
								<Button variant='outline' size='sm' type='reset'>
									Discard
								</Button>
								<ActionButton size='sm'>Save Listing</ActionButton>
							</div>
						</CardFooter>
					)}
				</Card>
			</form>
		</Form>
	)
}
