'use client'

import { updateName } from '@/actions/user'
import ActionButton from '@/components/action-button'
import { FormInput } from '@/components/form-input'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { AuthUser } from '@/lib/utils'
import { useFormState } from 'react-dom'

export default function NameForm({ user }: { user: AuthUser }) {
	const [state, action] = useFormState(updateName, null)

	return (
		<form action={action}>
			<Card>
				<CardHeader>
					<CardTitle>Your Name</CardTitle>
					<CardDescription>Your full name on your account.</CardDescription>
				</CardHeader>
				<CardContent>
					<FormInput name='name' placeholder='Your name' defaultValue={user.name ?? ''} error={state?.errors.name} />
				</CardContent>
				<CardFooter className='border-t px-6 py-4'>
					<ActionButton>Save</ActionButton>
				</CardFooter>
			</Card>
		</form>
	)
}
