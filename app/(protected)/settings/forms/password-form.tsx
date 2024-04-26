'use client'

import { updatePassword } from '@/actions/user'
import ActionButton from '@/components/action-button'
import { FormError, useErrorToaster, useSuccessTrigger } from '@/components/form'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { useRef } from 'react'
import { useFormState } from 'react-dom'
import toast from 'react-hot-toast'

export default function PasswordForm() {
	const ref = useRef<HTMLFormElement>()
	const [state, action] = useFormState(updatePassword, null)
	useErrorToaster(state?.errors?._global)
	useSuccessTrigger(state?.successTrigger, () => {
		toast.success('Password updated')
		ref.current?.reset()
	})

	return (
		<form action={action} ref={ref}>
			<Card>
				<CardHeader>
					<CardTitle>Your Password</CardTitle>
					<CardDescription>Change the password you use to sign in.</CardDescription>
				</CardHeader>
				<CardContent className='grid gap-4'>
					<div className='grid gap-2'>
						<Input name='password' placeholder='Password' type='password' />
						<FormError errors={state?.errors} id='password' />
					</div>
					<div className='grid gap-2'>
						<Input name='confirm_password' placeholder='Confirm Password' type='password' />
						<FormError errors={state?.errors} id='confirm_password' />
					</div>
				</CardContent>
				<CardFooter className='border-t px-6 py-4'>
					<ActionButton>Save</ActionButton>
				</CardFooter>
			</Card>
		</form>
	)
}
