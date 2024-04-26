'use client'

import { createRule } from '@/actions/rule'
import ActionButton from '@/components/action-button'
import { FormError, useErrorToaster, useSuccessTrigger } from '@/components/form'
import { Button } from '@/components/ui/button'
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { PlusCircleIcon } from 'lucide-react'
import { useState } from 'react'
import { useFormState } from 'react-dom'

// BUG: After adding a rule, the trigger does not open the dialog back up
export default function NewRuleButton() {
	const [open, setOpen] = useState(false)

	const [state, action] = useFormState(createRule, null)
	useErrorToaster(state?.errors?._global)
	useSuccessTrigger(state?.successTrigger, () => setOpen(false))

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button size='sm' className='h-8 gap-1'>
					<PlusCircleIcon className='h-3.5 w-3.5' />
					<span className='sr-only sm:not-sr-only sm:whitespace-nowrap'>Add Rule</span>
				</Button>
			</DialogTrigger>
			<DialogContent>
				<form className='grid gap-4' action={action}>
					<DialogHeader>
						<DialogTitle>New Rule</DialogTitle>
						<DialogDescription>Add a rule that is followed when generating listing details automatically.</DialogDescription>
					</DialogHeader>

					<div className='grid gap-2'>
						<Input name='rule' placeholder='Rule' />
						<FormError errors={state?.errors} id='rule' />
					</div>

					<DialogFooter className='sm:justify-start'>
						<ActionButton>Create</ActionButton>
						<DialogClose asChild>
							<Button type='button' variant='secondary'>
								Close
							</Button>
						</DialogClose>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	)
}