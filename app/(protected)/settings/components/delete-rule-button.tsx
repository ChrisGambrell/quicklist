'use client'

import { deleteRule } from '@/actions/rule'
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
import { XIcon } from 'lucide-react'
import { useState } from 'react'
import { useFormState } from 'react-dom'

export default function DeleteRuleButton({ ruleId }: { ruleId: string }) {
	const [open, setOpen] = useState(false)

	const useDeleteRule = deleteRule.bind(null, ruleId)
	const [state, action] = useFormState(useDeleteRule, null)
	useErrorToaster(state?.errors?._global)
	useSuccessTrigger(state?.successTrigger, () => setOpen(false))

	return (
		<AlertDialog open={open} onOpenChange={setOpen}>
			<AlertDialogTrigger asChild>
				<Button size='sm' variant='ghost'>
					<XIcon className='text-destructive w-5 h-5' />
				</Button>
			</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
					<AlertDialogDescription>
						This action cannot be undone. This will permanently delete your rule and remove the data from our servers.
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
