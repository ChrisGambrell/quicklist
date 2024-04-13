'use client'

import { signIn } from '@/actions/auth'
import ActionButton from '@/components/action-button'
import { FormError, useErrorToaster } from '@/components/form'
import NavLink from '@/components/nav-link'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useFormState } from 'react-dom'

export default function SignInPage() {
	const [state, action] = useFormState(signIn, null)
	useErrorToaster(state?.errors?._global)

	return (
		<form className='grid gap-6' action={action}>
			<h2 className='tracking-tight font-bold text-3xl'>Sign In</h2>

			<div className='grid gap-2'>
				<Label htmlFor='email'>Email address</Label>
				<Input id='email' name='email' type='text' />
				<FormError errors={state?.errors} id='email' />
			</div>
			<div className='grid gap-2'>
				<Label htmlFor='password'>Password</Label>
				<Input id='password' name='password' type='password' />
				<FormError errors={state?.errors} id='password' />
			</div>

			<NavLink href='/sign-up'>Need an account? Sign up</NavLink>

			<div>
				<ActionButton>Sign in</ActionButton>
			</div>
		</form>
	)
}
