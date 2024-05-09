import feature from '@/assets/feature.png'
import NoAuthLayout from '@/components/layout/noauth-layout'
import Image from 'next/image'
import GitHubSignIn from './forms/github-sign-in'
import GoogleSignIn from './forms/google-sign-in'
import PasswordSignIn from './forms/password-sign-in'

export default function Component() {
	return (
		<NoAuthLayout action={{ href: '/sign-up', label: 'Sign Up' }}>
			<div className='mx-auto grid w-full max-w-[900px] grid-cols-1 items-center gap-12 rounded-xl bg-white p-8 shadow-lg dark:bg-gray-950 md:grid-cols-2 border'>
				<div className='space-y-4'>
					<div className='space-y-2'>
						<h1 className='text-3xl font-bold'>Sign In</h1>
						<p className='text-gray-500 dark:text-gray-400'>Enter your email below to sign in to your account.</p>
					</div>

					<div className='space-y-4'>
						<PasswordSignIn />

						<div className='flex items-center gap-2'>
							<div className='h-px flex-1 bg-gray-200 dark:bg-gray-800' />
							<span className='text-gray-500 dark:text-gray-400'>or</span>
							<div className='h-px flex-1 bg-gray-200 dark:bg-gray-800' />
						</div>

						<div className='flex flex-col gap-2'>
							<GoogleSignIn />
							<GitHubSignIn />
						</div>
					</div>
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
