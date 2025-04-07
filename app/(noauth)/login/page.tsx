'use client'

import { login, oauth } from '@/actions/auth'
import { Icons } from '@/components/icons'
import { AuthLayout } from '@/components/layout/auth-layout'
import { CardContent } from '@/components/ui/card'
import { ActionButton } from '@/components/ui/f/action-button'
import { FormInput } from '@/components/ui/f/form-input'
import { useForm } from '@/components/ui/f/use-form'
import { Label } from '@/components/ui/label'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

export default function LoginPage() {
	return (
		<Suspense>
			<Page />
		</Suspense>
	)
}

function Page() {
	const searchParams = useSearchParams()
	const callbackUrl = searchParams.get('callbackUrl') ?? '/listings'

	const [state, action] = useForm(login)

	return (
		<AuthLayout title='Welcome back' desc='Enter your credentials to access your account'>
			<CardContent>
				<form action={action} className='grid gap-4'>
					<input type='hidden' name='callbackUrl' value={callbackUrl} />
					<FormInput label='Email' name='email' placeholder='m@example.com' state={state} />
					<FormInput
						label={
							<div className='flex items-center'>
								<Label htmlFor='password'>Password</Label>
								<Link className='ml-auto inline-block text-sm hover:underline' href='/forgot'>
									Forgot password?
								</Link>
							</div>
						}
						name='password'
						type='password'
						clearOnError
						state={state}
					/>
					<ActionButton>Log in</ActionButton>

					<div className='relative'>
						<div className='absolute inset-0 flex items-center'>
							<span className='w-full border-t' />
						</div>
						<div className='relative flex justify-center text-xs uppercase'>
							<span className='bg-background px-2 text-muted-foreground'>Or continue with</span>
						</div>
					</div>

					<div className='grid gap-2'>
						<ActionButton formAction={oauth.bind(null, 'github')} variant='outline'>
							<Icons.github />
							<span>GitHub</span>
						</ActionButton>
						<ActionButton formAction={oauth.bind(null, 'google')} variant='outline'>
							<Icons.google />
							<span>Google</span>
						</ActionButton>
					</div>

					<p className='text-center text-sm text-muted-foreground'>
						Don&apos;t have an account?{' '}
						<Link className='text-primary hover:underline' href='/register'>
							Sign up
						</Link>
					</p>
				</form>
			</CardContent>
		</AuthLayout>
	)
}
