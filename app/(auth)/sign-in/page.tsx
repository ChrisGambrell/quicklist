'use client'

import { signInWithOAuth, signInWithPassword } from '@/actions/auth'
import ActionButton from '@/components/action-button'
import { FormError } from '@/components/form-error'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'
import { useFormState } from 'react-dom'

export default function SignInPage() {
	const [passwordState, passwordAction] = useFormState(signInWithPassword, null)
	const useSignInWithGithub = signInWithOAuth.bind(null, 'github')
	const useSignInWithGoogle = signInWithOAuth.bind(null, 'google')

	return (
		<Card className='mx-auto max-w-sm border-0 shadow-none sm:border sm:shadow-sm sm:my-20'>
			<CardHeader>
				<CardTitle className='text-2xl'>Sign In</CardTitle>
				<CardDescription>Enter your email below to sign in to your account</CardDescription>
			</CardHeader>
			<CardContent>
				<form className='grid gap-4'>
					<div className='grid gap-2'>
						<Label htmlFor='email'>Email</Label>
						<Input id='email' name='email' type='email' placeholder='m@example.com' />
						<FormError state={passwordState} id='email' />
					</div>
					<div className='grid gap-2'>
						<div className='flex items-center'>
							<Label htmlFor='password'>Password</Label>
							<Link href='/forgot' className='ml-auto inline-block text-sm underline'>
								Forgot your password?
							</Link>
						</div>
						<Input id='password' name='password' type='password' />
						<FormError state={passwordState} id='password' />
					</div>
					<ActionButton formAction={passwordAction} type='submit' className='w-full'>
						Sign in
					</ActionButton>
					<ActionButton formAction={useSignInWithGoogle} variant='outline' className='w-full'>
						Sign in with Google
					</ActionButton>
					<ActionButton formAction={useSignInWithGithub} variant='outline' className='w-full'>
						Sign in with Github
					</ActionButton>
				</form>
				<div className='mt-4 text-center text-sm'>
					Don&apos;t have an account?{' '}
					<Link href='/sign-up' className='underline'>
						Sign up
					</Link>
				</div>
			</CardContent>
		</Card>
	)
}
