'use client'

import { signInWithPassword } from '@/actions/auth'
import ActionButton from '@/components/action-button'
import { FormError } from '@/components/form-error'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'
import { useFormState } from 'react-dom'

export default function PasswordSignIn() {
	const [state, action] = useFormState(signInWithPassword, null)

	return (
		<form action={action} className='grid gap-4'>
			<div className='grid gap-2'>
				<Label htmlFor='email'>Email</Label>
				<Input id='email' name='email' placeholder='me@example.com' type='email' />
				<FormError value={state?.errors.email} />
			</div>

			<div className='grid gap-2'>
				<div className='flex items-center'>
					<Label htmlFor='password'>Password</Label>
					<Link className='ml-auto inline-block text-sm underline' href='/forgot'>
						Forgot your password?
					</Link>
				</div>

				<Input id='password' name='password' type='password' />
				<FormError value={state?.errors.password} />
			</div>

			<ActionButton>Sign In</ActionButton>
		</form>
	)
}
