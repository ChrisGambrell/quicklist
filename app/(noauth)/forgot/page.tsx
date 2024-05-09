import feature from '@/assets/feature.png'
import NoAuthLayout from '@/components/layout/noauth-layout'
import Image from 'next/image'
import ForgotPasswordForm from './forms/forgot-password-form'

export default function Component() {
	return (
		<NoAuthLayout action={{ href: '/sign-in', label: 'Sign In' }}>
			<div className='mx-auto grid w-full max-w-[900px] grid-cols-1 items-center gap-12 rounded-xl bg-white p-8 shadow-lg dark:bg-gray-950 md:grid-cols-2 border'>
				<div className='space-y-4'>
					<div className='space-y-2'>
						<h1 className='text-3xl font-bold'>Forgot Password</h1>
						<p className='text-gray-500 dark:text-gray-400'>Enter your email to reset your password.</p>
					</div>
					<ForgotPasswordForm />
				</div>

				<Image
					src={feature}
					alt='Authentication'
					className='mx-auto aspect-square overflow-hidden rounded-xl object-cover'
					height={550}
					width={550}
				/>
			</div>
		</NoAuthLayout>
	)
}
