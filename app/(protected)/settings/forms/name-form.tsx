'use client'

import { updateName } from '@/actions/user'
import ActionButton from '@/components/action-button'
import { useErrorToaster, useSuccessTrigger } from '@/components/form'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Tables } from '@/db_types'
import { useFormState } from 'react-dom'
import toast from 'react-hot-toast'

export default function NameForm({ user }: { user: Tables<'users'> }) {
	const [state, action] = useFormState(updateName, null)
	useErrorToaster(state?.errors?._global)
	useSuccessTrigger(state?.successTrigger, () => toast.success('Name updated'))

	return (
		<form action={action}>
			<Card>
				<CardHeader>
					<CardTitle>Your Name</CardTitle>
					<CardDescription>Your full name on your account.</CardDescription>
				</CardHeader>
				<CardContent>
					<Input name='full_name' placeholder='Your Name' defaultValue={user.full_name ?? ''} />
				</CardContent>
				<CardFooter className='border-t px-6 py-4'>
					<ActionButton>Save</ActionButton>
				</CardFooter>
			</Card>
		</form>
	)
}
