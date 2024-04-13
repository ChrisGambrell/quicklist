'use client'

import { deleteListing } from '@/actions/listing'
import ActionButton from '@/components/action-button'
import { useErrorToaster, useSuccessTrigger } from '@/components/form'
import {
	AlertDialog,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { useFormState } from 'react-dom'

export default function DeleteListingButton({ listingId }: { listingId: string }) {
	const [open, setOpen] = useState(false)

	const useDeleteListing = deleteListing.bind(null, listingId)
	const [state, action] = useFormState(useDeleteListing, null)
	useErrorToaster(state?.errors?._global)
	useSuccessTrigger(state?.successTrigger, () => setOpen(false))

	return (
		<AlertDialog open={open} onOpenChange={setOpen}>
			<AlertDialogTrigger asChild>
				<Button className='w-full sm:w-fit' type='button' variant='destructive'>
					Delete listing
				</Button>
			</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
					<AlertDialogDescription>
						This action cannot be undone. This will permanently delete your listing and remove the data from our servers.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<form action={action}>
					<AlertDialogFooter>
						<AlertDialogCancel type='button'>Cancel</AlertDialogCancel>
						<ActionButton>Continue</ActionButton>
					</AlertDialogFooter>
				</form>
			</AlertDialogContent>
		</AlertDialog>
	)
}
