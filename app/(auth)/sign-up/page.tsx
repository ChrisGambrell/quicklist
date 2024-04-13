'use client'

import { signUp } from '@/actions/auth'
import ActionButton from '@/components/action-button'
import { FormError, useErrorToaster, useSuccessTrigger } from '@/components/form'
import NavLink from '@/components/nav-link'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useFormState } from 'react-dom'
import toast from 'react-hot-toast'

export default function SignUpPage() {
	const [state, action] = useFormState(signUp, null)
	useErrorToaster(state?.errors?._global)
	useSuccessTrigger(state?.successTrigger, () => toast.success('Account created successfully. Check your email for verification.'))

	return (
		<form className='grid gap-6' action={action}>
			<h2 className='tracking-tight font-bold text-3xl'>Sign Up</h2>

			<div className='grid gap-2'>
				<Label htmlFor='name'>Name</Label>
				<Input id='name' name='name' type='text' />
				<FormError errors={state?.errors} id='name' />
			</div>
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

			<NavLink href='/sign-in'>Already have an account? Sign in</NavLink>

			<div>
				<ActionButton>Sign up</ActionButton>
			</div>
		</form>
	)
}
