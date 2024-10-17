'use client'

import { login, oauth } from '@/actions/auth'
import { ActionButton } from '@/components/action-button'
import { FormInput } from '@/components/form-input'
import { useFormState } from 'react-dom'

export function ClientPage() {
	const [state, action] = useFormState(login, null)

	return (
		<form action={action} className='space-y-4'>
			<div className='grid gap-4'>
				<FormInput label='Email address' name='email' placeholder='me@example.com' type='email' error={state?.errors.email} />
				<FormInput label='Password' name='password' type='password' error={state?.errors.password} />
				{/* BUG: Missing forgot password link */}
				<ActionButton>Sign in</ActionButton>
			</div>

			<div className='flex items-center gap-2'>
				<div className='h-px flex-1 bg-gray-200 dark:bg-gray-800' />
				<span className='text-gray-500 dark:text-gray-400'>or</span>
				<div className='h-px flex-1 bg-gray-200 dark:bg-gray-800' />
			</div>

			<div className='flex flex-col gap-2'>
				<ActionButton formAction={oauth.bind(null, 'google')} className='w-full' variant='outline'>
					Sign in with Google
				</ActionButton>
				<ActionButton formAction={oauth.bind(null, 'github')} className='w-full' variant='outline'>
					Sign in with GitHub
				</ActionButton>
			</div>
		</form>
	)
}
