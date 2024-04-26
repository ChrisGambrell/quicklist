'use client'

import { createListing } from '@/actions/listing'
import ActionButton from '@/components/action-button'
import { useErrorToaster } from '@/components/form'
import { PlusCircleIcon } from 'lucide-react'
import { useFormState } from 'react-dom'

export default function AddListingButton() {
	const [state, action] = useFormState(createListing, null)
	useErrorToaster(state?.errors._global)

	return (
		<form action={action}>
			<ActionButton size='sm' className='h-8 gap-1'>
				<PlusCircleIcon className='w-3.5 h-3.5' />
				Add Listing
			</ActionButton>
		</form>
	)
}
