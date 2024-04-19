'use client'

import { createListing } from '@/actions/listing'
import ActionButton from '@/components/action-button'
import { useErrorToaster } from '@/components/form'
import { PlusIcon } from 'lucide-react'
import { useFormState } from 'react-dom'

export default function NewListing() {
	const [state, action] = useFormState(createListing, null)
	useErrorToaster(state?.errors._global)

	return (
		<form action={action}>
			<ActionButton size='sm'>
				<PlusIcon className='w-4 h-4 mr-2' />
				New Listing
			</ActionButton>
		</form>
	)
}
