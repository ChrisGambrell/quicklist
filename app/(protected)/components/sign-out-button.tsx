'use client'

import { signOut } from '@/actions/auth'
import { useErrorToaster } from '@/components/form'
import { useFormState } from 'react-dom'

export default function SignOutButton() {
	const [state, action] = useFormState(signOut, null)
	useErrorToaster(state?.errors._global)

	return (
		<form action={action}>
			<button className='font-medium text-destructive hover:underline cursor-pointer'>Sign out</button>
		</form>
	)
}
