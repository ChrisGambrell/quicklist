'use client'

import { updateListing } from '@/actions/listing'
import ActionButton from '@/components/action-button'
import { FormError, useErrorToaster } from '@/components/form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Tables } from '@/db_types'
import { useFormState } from 'react-dom'
import RegenerateButton from './regenerate-button'

const placeholder = {
	title: "Classic Navy and White Checkered Men's Long Sleeve Shirt",
	description: "'Enhance your wardrobe with this timeless navy and white checkered long sleeve shirt...'",
	price: '12.49',
}

export default function ListingForm({ listing }: { listing: Tables<'listings'> }) {
	const useUpdateListing = updateListing.bind(null, listing.id)
	const [state, action] = useFormState(useUpdateListing, null)
	useErrorToaster(state?.errors?._global)

	return (
		<form className='grid gap-4 sm:gap-8'>
			<div className='grid gap-2'>
				<Label htmlFor='title'>Title</Label>
				<Input defaultValue={listing.title ?? ''} id='title' name='title' placeholder={placeholder.title} />
				<FormError errors={state?.errors} id='title' />
			</div>
			<div className='grid gap-2'>
				<Label htmlFor='description'>Description</Label>
				<Textarea
					defaultValue={listing.description ?? ''}
					id='description'
					name='description'
					placeholder={placeholder.description}
					rows={6}
				/>
				<FormError errors={state?.errors} id='description' />
			</div>
			<div className='grid gap-2'>
				<Label htmlFor='price'>Price</Label>
				<Input defaultValue={listing.price?.toString()} id='price' name='price' placeholder={placeholder.price} />
				<FormError errors={state?.errors} id='price' />
			</div>

			<div className='flex-items-center space-x-2'>
				<ActionButton className='sm:w-fit' formAction={action}>
					Update details
				</ActionButton>
				<RegenerateButton listingId={listing.id} />
			</div>
		</form>
	)
}
