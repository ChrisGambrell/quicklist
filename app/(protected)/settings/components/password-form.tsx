'use client'

import { updatePassword } from '@/actions/user'
import ActionButton from '@/components/action-button'
import { FormError, useErrorToaster } from '@/components/form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tables } from '@/db_types'
import { useFormState } from 'react-dom'

export default function PasswordForm() {
	const [state, action] = useFormState(updatePassword, null)
	useErrorToaster(state?.errors?._global)

	return (
		<form className='grid gap-4' action={action}>
			<div className='flex items-end space-x-4'>
				<div className='flex-1'>
					<h2 className='tracking-tight font-bold text-3xl'>My Password</h2>
				</div>
			</div>

			<div className='grid gap-2'>
				<Label htmlFor='password'>Password</Label>
				<Input id='password' name='password' type='password' />
				<FormError errors={state?.errors} id='password' />
			</div>
			<div className='grid gap-2'>
				<Label htmlFor='confirm_password'>Confirm password</Label>
				<Input id='confirm_password' name='confirm_password' type='password' />
				<FormError errors={state?.errors} id='confirm_password' />
			</div>

			<div>
				<ActionButton>Update profile</ActionButton>
			</div>
		</form>
	)
}
