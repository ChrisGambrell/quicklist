'use client'

import { updateListing } from '@/actions/listing'
import { ActionButton } from '@/components/action-button'
import { FormInput } from '@/components/form-input'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Listing } from '@prisma/client'
import { useFormState } from 'react-dom'

const placeholder = {
	title: "Classic Navy and White Checkered Men's Long Sleeve Shirt",
	price: '12.49',
	desc: 'Enhance your wardrobe with this timeless navy and white checkered long sleeve shirt...',
}

export default function ListingForm({ canEdit, listing }: { canEdit: boolean; listing: Listing }) {
	// TODO: Search for bind and replace things like this
	// const useUpdateListing = updateListing.bind(null, { listingId: listing.id })
	const [state, action] = useFormState(updateListing.bind(null, { listingId: listing.id }), null)

	return (
		<form action={action}>
			<Card>
				<CardHeader>
					<CardTitle>Listing Details</CardTitle>
				</CardHeader>
				<CardContent>
					<div className='grid gap-6'>
						<FormInput
							label='Title'
							name='title'
							placeholder={placeholder.title}
							defaultValue={listing.title ?? ''}
							error={state?.errors.title}
						/>
						<FormInput
							label='Price'
							name='price'
							placeholder={placeholder.price}
							defaultValue={listing.price?.toString() ?? ''}
							error={state?.errors.price}
						/>
						{/* TODO: Should be form textarea */}
						<FormInput
							label='Description'
							name='desc'
							placeholder={placeholder.desc}
							defaultValue={listing.desc ?? ''}
							error={state?.errors.desc}
						/>
					</div>
				</CardContent>
				{canEdit && (
					<CardFooter>
						<div className='ml-auto flex gap-2'>
							<Button variant='outline' type='reset'>
								Discard
							</Button>
							<ActionButton>Save Listing</ActionButton>
						</div>
					</CardFooter>
				)}
			</Card>
		</form>
	)
}
