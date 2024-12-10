'use client'

import { upsertRule } from '@/actions/rule'
import { Rule } from '@prisma/client'
import { ReactNode, useEffect, useState } from 'react'
import { useFormState } from 'react-dom'
import ActionButton from './action-button'
import { FormInput } from './form-input'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog'

export function UpsertRule({ children, rule }: { children: ReactNode; rule?: Rule }) {
	const [open, setOpen] = useState(false)

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>{children}</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>{!rule ? 'Add' : 'Update'} rule</DialogTitle>
				</DialogHeader>
				<Form rule={rule} setOpen={setOpen} />
			</DialogContent>
		</Dialog>
	)
}

function Form({ rule, setOpen }: { rule?: Rule; setOpen: (open: boolean) => void }) {
	const [state, action] = useFormState(upsertRule.bind(null, { ruleId: rule?.id }), null)

	useEffect(() => {
		if (state === undefined) setOpen(false)
	}, [setOpen, state])

	return (
		<form action={action} className='grid gap-4'>
			<FormInput label='Rule' name='rule' defaultValue={rule?.rule ?? ''} error={state?.errors.rule} />
			<DialogFooter>
				<ActionButton>{!rule ? 'Add' : 'Update'} rule</ActionButton>
			</DialogFooter>
		</form>
	)
}
