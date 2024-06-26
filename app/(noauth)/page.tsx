import NoAuthLayout from '@/components/layout/noauth-layout'
import Logo from '@/components/logo'
import { buttonVariants } from '@/components/ui/button'
import Link from 'next/link'

export default function LandingPage() {
	return (
		<NoAuthLayout action={{ href: '/sign-in', label: 'Sign In' }}>
			<div className='container px-4 md:px-6'>
				<div className='grid gap-6 lg:grid-cols-[1fr_550px] lg:gap-12 xl:grid-cols-[1fr_650px]'>
					<div className='flex flex-col justify-center space-y-6'>
						<div className='space-y-4'>
							<h1 className='text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl'>
								Effortlessly <span className='text-primary'>Optimize</span> Your Online Listings
							</h1>
							<p className='max-w-[600px] text-gray-500 md:text-lg lg:text-xl dark:text-gray-400'>
								Elevate your online listings effortlessly. QuickList uses AI to automatically craft compelling titles,
								detailed descriptions, and smart pricing from your photos—quickly and effectively getting your items
								noticed.
							</p>
						</div>
						<div className='flex flex-col gap-4 sm:flex-row'>
							<Link className={buttonVariants({ className: 'h-12 px-8' })} href='/sign-in'>
								Sign In
							</Link>
							<Link className={buttonVariants({ className: 'h-12 px-8', variant: 'outline' })} href='/sign-in'>
								Get Started
							</Link>
						</div>
					</div>
					<Logo size={650} />
				</div>
			</div>
		</NoAuthLayout>
	)
}
