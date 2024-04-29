'use client'

import { signUp } from '@/actions/auth'
import ActionButton from '@/components/action-button'
import { FormError } from '@/components/form-error'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'
import { useFormState } from 'react-dom'

export default function SignUpPage() {
	const [state, action] = useFormState(signUp, null)

	return (
		<Card className='mx-auto max-w-sm border-0 shadow-none sm:border sm:shadow-sm sm:my-20'>
			<CardHeader>
				<CardTitle className='text-2xl'>Sign Up</CardTitle>
				<CardDescription>Enter your information to sign up</CardDescription>
			</CardHeader>
			<CardContent>
				<form className='grid gap-4' action={action}>
					<div className='grid gap-2'>
						<Label htmlFor='name'>Name</Label>
						<Input id='name' name='name' placeholder='Your name' />
						<FormError value={state?.errors.name} />
					</div>
					<div className='grid gap-2'>
						<Label htmlFor='email'>Email</Label>
						<Input id='email' name='email' type='email' placeholder='me@example.com' />
						<FormError value={state?.errors.email} />
					</div>
					{/* TODO: Confirm password? */}
					<div className='grid gap-2'>
						<Label htmlFor='password'>Password</Label>
						<Input id='password' name='password' type='password' />
						<FormError value={state?.errors.password} />
					</div>
					<ActionButton type='submit' className='w-full'>
						Sign up
					</ActionButton>
				</form>
				<div className='mt-4 text-center text-sm'>
					Already have an account?{' '}
					<Link href='/sign-in' className='underline'>
						Sign in
					</Link>
				</div>
			</CardContent>
		</Card>
	)
}
