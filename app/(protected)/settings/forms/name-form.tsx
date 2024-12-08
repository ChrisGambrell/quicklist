'use client'

import { updateName } from '@/actions/user'
import ActionButton from '@/components/action-button'
import { FormError } from '@/components/form-error'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
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
					<div className='grid gap-2'>
						<Input name='name' placeholder='Your Name' defaultValue={user.name ?? ''} />
						<FormError value={state?.errors.name} />
					</div>
				</CardContent>
				<CardFooter className='border-t px-6 py-4'>
					<ActionButton>Save</ActionButton>
				</CardFooter>
			</Card>
		</form>
	)
}
