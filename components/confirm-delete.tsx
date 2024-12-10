'use client'

import { ReactNode, useEffect, useState } from 'react'
import { useFormState } from 'react-dom'
import { ActionButton } from './action-button'
import {
	AlertDialog,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from './ui/alert-dialog'

export function ConfirmDelete({ action: _action, children }: { action: () => Promise<unknown>; children: ReactNode }) {
	const [state, action] = useFormState(_action, null)
	const [open, setOpen] = useState(false)

	useEffect(() => {
		if (state === undefined) setOpen(false)
	}, [state])

	return (
		<AlertDialog open={open} onOpenChange={setOpen}>
			<AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
					<AlertDialogDescription>
						This action cannot be undone. This will permanently delete this item and remove the data from our servers.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>Cancel</AlertDialogCancel>
					<form action={action}>
						<ActionButton className='w-full' variant='destructive'>
							Continue
						</ActionButton>
					</form>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	)
}
