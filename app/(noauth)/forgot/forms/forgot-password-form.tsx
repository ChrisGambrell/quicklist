'use client'

import { sendPasswordReset } from '@/actions/auth'
import ActionButton from '@/components/action-button'
import { FormError } from '@/components/form-error'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useFormState } from 'react-dom'

export default function ForgotPasswordForm() {
	const [state, action] = useFormState(sendPasswordReset, null)

	return (
		<form action={action} className='grid gap-4'>
			<div className='grid gap-2'>
				<Label htmlFor='email'>Email</Label>
				<Input id='email' name='email' placeholder='me@example.com' type='email' />
				<FormError value={state?.errors.email} />
			</div>

			<ActionButton>Send reset</ActionButton>
		</form>
	)
}
