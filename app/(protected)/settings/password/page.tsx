'use client'

import { updatePassword } from '@/actions/user'
import ActionButton from '@/components/action-button'
import { FormInput } from '@/components/form-input'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
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
					<FormInput name='password' placeholder='Password' type='password' error={state?.errors.password} />
					<FormInput
						name='confirmPassword'
						placeholder='Confirm password'
						type='password'
						error={state?.errors.confirmPassword}
					/>
				</CardContent>
				<CardFooter className='border-t px-6 py-4'>
					<ActionButton>Save</ActionButton>
				</CardFooter>
			</Card>
		</form>
	)
}
