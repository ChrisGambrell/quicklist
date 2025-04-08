'use client'

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { ActionButton } from '@/components/ui/f/action-button'
import { FormInput } from '@/components/ui/f/form-input'
import { useFormState } from 'react-dom'

export default function PasswordForm() {
	// TODO: updatePassword
	// const [state, action] = useFormState(updatePassword, null)
	const [state, action] = useFormState(async (_: unknown, formData: FormData) => {}, null)

	return (
		<form action={action}>
			<Card>
				<CardHeader>
					<CardTitle>Your Password</CardTitle>
					<CardDescription>Change the password you use to sign in.</CardDescription>
				</CardHeader>
				<CardContent className='grid gap-4'>
					{/* TODO: State */}
					<FormInput name='password' type='password' state={undefined} />
					{/* TODO: State */}
					<FormInput name='confirmPassword' type='password' state={undefined} />
				</CardContent>
				<CardFooter className='border-t px-6 py-4'>
					<ActionButton>Save</ActionButton>
				</CardFooter>
			</Card>
		</form>
	)
}
