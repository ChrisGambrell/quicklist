'use client'

import { updatePassword } from '@/actions/user'
import ActionButton from '@/components/action-button'
import { FormError } from '@/components/form-error'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { useFormState } from 'react-dom'

export default function PasswordSettingsPage() {
	const [state, action] = useFormState(updatePassword, null)

	return (
		<form action={action}>
			<Card>
				<CardHeader>
					<CardTitle>Your Password</CardTitle>
					<CardDescription>Change the password you use to sign in.</CardDescription>
				</CardHeader>
				<CardContent className='grid gap-4'>
					<div className='grid gap-2'>
						<Input name='password' placeholder='Password' type='password' />
						<FormError value={state?.errors.password} />
					</div>
					<div className='grid gap-2'>
						<Input name='confirmPassword' placeholder='Confirm Password' type='password' />
						<FormError value={state?.errors.confirmPassword} />
					</div>
				</CardContent>
				<CardFooter className='border-t px-6 py-4'>
					<ActionButton>Save</ActionButton>
				</CardFooter>
			</Card>
		</form>
	)
}
