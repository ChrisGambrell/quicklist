'use client'

import { generateListingData } from '@/actions/listing'
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

// BUG: Not dismissing alert when done
export default function RegenerateButton({ listingId }: { listingId: string }) {
	const [open, setOpen] = useState(false)

	const useGenerateListingData = generateListingData.bind(null, listingId)
	const [state, action] = useFormState(useGenerateListingData, null)
	useErrorToaster(state?.errors?._global)
	useSuccessTrigger(state?.successTrigger, () => setOpen(false))

	return (
		<AlertDialog open={open} onOpenChange={setOpen}>
			<AlertDialogTrigger asChild>
				<Button className='sm:w-fit' variant='secondary'>
					Regenerate from images
				</Button>
			</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
					<AlertDialogDescription>
						This action cannot be undone. This will permanently overwrite your listing&apos;s data.
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
