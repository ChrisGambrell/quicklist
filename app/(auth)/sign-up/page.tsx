import feature from '@/assets/feature.png'
import NoAuthLayout from '@/components/noauth-layout'
import Image from 'next/image'
import PasswordSignUp from './forms/password-sign-up'

export default function Component() {
	return (
		<NoAuthLayout action={{ href: '/sign-in', label: 'Sign In' }}>
			<div className='mx-auto grid w-full max-w-[900px] grid-cols-1 items-center gap-12 rounded-xl bg-white p-8 shadow-lg dark:bg-gray-950 md:grid-cols-2 border'>
				<div className='space-y-4'>
					<div className='space-y-2'>
						<h1 className='text-3xl font-bold'>Sign Up</h1>
						<p className='text-gray-500 dark:text-gray-400'>Enter your information to create an account.</p>
					</div>
					<PasswordSignUp />
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
