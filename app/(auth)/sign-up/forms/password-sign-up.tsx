'use client'

import { signUp } from '@/actions/auth'
import ActionButton from '@/components/action-button'
import { FormError } from '@/components/form-error'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useFormState } from 'react-dom'

export default function PasswordSignUp() {
	const [state, action] = useFormState(signUp, null)

	return (
		<form action={action} className='grid gap-4'>
			<div className='grid gap-2'>
				<Label htmlFor='email'>Name</Label>
				<Input id='name' name='name' placeholder='Your name' />
				<FormError value={state?.errors.name} />
			</div>

			<div className='grid gap-2'>
				<Label htmlFor='email'>Email</Label>
				<Input id='email' name='email' placeholder='me@example.com' type='email' />
				<FormError value={state?.errors.email} />
			</div>

			<div className='grid gap-2'>
				<Label htmlFor='password'>Password</Label>
				<Input id='password' name='password' type='password' />
				<FormError value={state?.errors.password} />
			</div>

			<ActionButton>Sign Up</ActionButton>
		</form>
	)
}
