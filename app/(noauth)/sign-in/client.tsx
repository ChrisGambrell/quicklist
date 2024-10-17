'use client'

import { login, oauth } from '@/actions/auth'
import { ActionButton } from '@/components/action-button'
import { FormError } from '@/components/form-error'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'
import { useFormState } from 'react-dom'

export function ClientPage() {
	const [state, action] = useFormState(login, null)

	return (
		<form action={action} className='space-y-4'>
			<div className='grid gap-4'>
				<div className='grid gap-2'>
					<Label htmlFor='email'>Email address</Label>
					<Input id='email' name='email' placeholder='me@example.com' type='email' />
					<FormError value={state?.errors.email} />
				</div>

				<div className='grid gap-2'>
					<div className='flex items-center'>
						<Label htmlFor='password'>Password</Label>
						<Link className='ml-auto inline-block text-sm underline' href='/forgot'>
							Forgot your password?
						</Link>
					</div>

					<Input id='password' name='password' type='password' />
					<FormError value={state?.errors.password} />
				</div>

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
