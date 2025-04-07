'use client'

import { register } from '@/actions/auth'
import { AuthLayout } from '@/components/layout/auth-layout'
import { CardContent } from '@/components/ui/card'
import { ActionButton } from '@/components/ui/f/action-button'
import { FormCheckbox } from '@/components/ui/f/form-checkbox'
import { FormInput } from '@/components/ui/f/form-input'
import { useForm } from '@/components/ui/f/use-form'
import Link from 'next/link'

export default function RegisterPage() {
	const [state, action] = useForm(register)

	return (
		<AuthLayout title='Create an account' desc='Enter your details to create your account'>
			<CardContent>
				<form action={action} className='grid gap-4'>
					<div className='grid grid-cols-2 gap-2'>
						<FormInput label='First name' name='firstName' placeholder='Max' state={state} />
						<FormInput label='Last name' name='lastName' placeholder='Robinson' state={state} />
					</div>
					<FormInput label='Email' name='email' placeholder='m@example.com' state={state} />
					<FormInput label='Password' name='password' type='password' state={state} />
					<FormInput label='Confirm password' name='confirmPassword' type='password' state={state} clearOnError />

					{/* TODO: Require TOS */}
					<FormCheckbox
						label={
							<>
								I agree to the{' '}
								<Link href='/terms' className='text-primary hover:underline'>
									Terms of Service
								</Link>{' '}
								and{' '}
								<Link href='/privacy' className='text-primary hover:underline'>
									Privacy Policy
								</Link>
							</>
						}
						name='terms'
						state={state}
					/>

					<ActionButton>Create account</ActionButton>

					<div className='relative'>
						<div className='absolute inset-0 flex items-center'>
							<span className='w-full border-t' />
						</div>
						<div className='relative flex justify-center text-xs uppercase'>
							<span className='bg-background px-2 text-muted-foreground'>Or continue with</span>
						</div>
					</div>

					{/* <div className='grid gap-2'>
						<ActionButton formAction={oauth.bind(null, 'github')} variant='outline'>
							<Icons.github />
							<span>GitHub</span>
						</ActionButton>
						<ActionButton formAction={oauth.bind(null, 'google')} variant='outline'>
							<Icons.google />
							<span>Google</span>
						</ActionButton>
					</div> */}

					<p className='text-center text-sm text-muted-foreground'>
						Already have an account?{' '}
						<Link className='text-primary hover:underline' href='/login'>
							Sign in
						</Link>
					</p>
				</form>
			</CardContent>
		</AuthLayout>
	)
}
