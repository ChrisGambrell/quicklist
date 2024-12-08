import feature from '@/assets/feature.png'
import NoAuthLayout from '@/components/layout/noauth-layout'
import Image from 'next/image'
import { ClientPage } from './client'

export default function SignInPage() {
	return (
		<NoAuthLayout action={{ href: '/sign-up', label: 'Sign Up' }}>
			<div className='mx-auto grid w-full max-w-[900px] grid-cols-1 items-center gap-12 rounded-xl bg-white p-8 shadow-lg dark:bg-gray-950 md:grid-cols-2 border'>
				<div className='space-y-4'>
					<div className='space-y-2'>
						<h1 className='text-3xl font-bold'>Sign In</h1>
						<p className='text-gray-500 dark:text-gray-400'>Enter your email below to sign in to your account.</p>
					</div>
					<ClientPage />
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
