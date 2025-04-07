import Link from 'next/link'
import { ReactNode } from 'react'
import { Icons } from '../icons'
import { buttonVariants } from '../ui/button'

export function TermsLayout({ children, title }: { children: ReactNode; title: string }) {
	return (
		<div className='min-h-screen bg-background relative'>
			<div className='absolute top-4 left-4 sm:top-8 sm:left-8'>
				<Link className={buttonVariants({ variant: 'ghost' })} href='/'>
					<Icons.chevronLeft />
					<span>Back to Home</span>
				</Link>
			</div>
			<div className='max-w-3xl mx-auto p-4 sm:p-8 pt-20'>
				<div className='text-center mb-12'>
					<h1 className='text-4xl font-bold'>{title}</h1>
					<p className='mt-3 text-muted-foreground'>Last updated: {new Date().toLocaleDateString()}</p>
				</div>

				<div className='space-y-8 leading-7'>{children}</div>

				<div className='mt-12 text-center'>
					<Link className={buttonVariants({ size: 'lg', variant: 'outline' })} href='/register'>
						Back to Registration
					</Link>
				</div>
			</div>
		</div>
	)
}
