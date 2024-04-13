'use client'

import { updateUser } from '@/actions/user'
import ActionButton from '@/components/action-button'
import { FormError, useErrorToaster } from '@/components/form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tables } from '@/db_types'
import { useFormState } from 'react-dom'

export default function ProfileForm({ user }: { user: Tables<'users'> }) {
	const useUpdateUser = updateUser.bind(null, user.id)
	const [state, action] = useFormState(useUpdateUser, null)
	useErrorToaster(state?.errors?._global)

	return (
		<form className='grid gap-4' action={action}>
			<div className='flex items-end space-x-4'>
				<div className='flex-1'>
					<h2 className='tracking-tight font-bold text-3xl'>My Profile</h2>
				</div>
			</div>

			<div className='grid gap-2'>
				<Label htmlFor='full_name'>Full name</Label>
				<Input id='full_name' name='full_name' defaultValue={user.full_name ?? ''} type='text' />
				<FormError errors={state?.errors} id='full_name' />
			</div>

			<div>
				<ActionButton>Update profile</ActionButton>
			</div>
		</form>
	)
}
