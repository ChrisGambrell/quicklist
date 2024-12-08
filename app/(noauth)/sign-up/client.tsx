'use client'

import { register } from '@/actions/auth'
import ActionButton from '@/components/action-button'
import { FormError } from '@/components/form-error'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useFormState } from 'react-dom'

export function ClientPage() {
	const [state, action] = useFormState(register, null)

	return (
		<form action={action} className='grid gap-y-4 gap-x-2 grid-cols-2'>
			<div className='grid gap-2'>
				<Label htmlFor='firstName'>First name</Label>
				<Input id='firstName' name='firstName' placeholder='First name' />
				<FormError value={state?.errors.firstName} />
			</div>
			<div className='grid gap-2'>
				<Label htmlFor='lastName'>Last name</Label>
				<Input id='lastName' name='lastName' placeholder='Last name' />
				<FormError value={state?.errors.lastName} />
			</div>

			<div className='col-span-full grid gap-2'>
				<Label htmlFor='email'>Email</Label>
				<Input id='email' name='email' placeholder='me@example.com' type='email' />
				<FormError value={state?.errors.email} />
			</div>

			<div className='grid gap-2'>
				<Label htmlFor='password'>Password</Label>
				<Input id='password' name='password' type='password' />
				<FormError value={state?.errors.password} />
			</div>
			<div className='grid gap-2'>
				<Label htmlFor='password'>Confirm password</Label>
				<Input id='confirmPassword' name='confirmPassword' type='password' />
				<FormError value={state?.errors.confirmPassword} />
			</div>

			<ActionButton className='col-span-full'>Sign Up</ActionButton>
		</form>
	)
}
