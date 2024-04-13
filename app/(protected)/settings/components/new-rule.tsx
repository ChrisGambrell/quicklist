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
import { PlusIcon } from 'lucide-react'
import { useState } from 'react'
import { useFormState } from 'react-dom'

export default function NewRule() {
	const [open, setOpen] = useState(false)

	const [state, action] = useFormState(createRule, null)
	useErrorToaster(state?.errors?._global)
	useSuccessTrigger(state?.successTrigger, () => setOpen(false))

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button size='sm'>
					<PlusIcon className='w-4 h-4 mr-2' />
					New Rule
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
