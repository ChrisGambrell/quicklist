'use client'

import { sendPasswordReset } from '@/actions/auth'
import ActionButton from '@/components/action-button'
import { FormError } from '@/components/form-error'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'
import { useFormState } from 'react-dom'

export default function ForgotPasswordPage() {
	const [state, action] = useFormState(sendPasswordReset, null)

	return (
		<Card className='mx-auto max-w-sm border-0 shadow-none sm:border sm:shadow-sm sm:my-20'>
			<CardHeader>
				<CardTitle className='text-2xl'>Forgot Password</CardTitle>
				<CardDescription>Enter your email to get an email to reset your password.</CardDescription>
			</CardHeader>
			<CardContent>
				<form className='grid gap-4' action={action}>
					<div className='grid gap-2'>
						<Label htmlFor='email'>Email</Label>
						<Input id='email' name='email' type='email' placeholder='me@example.com' />
						<FormError value={state?.errors.email} />
					</div>
					<ActionButton type='submit' className='w-full'>
						Send reset
					</ActionButton>
				</form>
				<div className='mt-4 text-center text-sm'>
					Back to{' '}
					<Link href='/sign-in' className='underline'>
						sign in
					</Link>
				</div>
			</CardContent>
		</Card>
	)
}
