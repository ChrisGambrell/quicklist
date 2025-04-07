import Link from 'next/link'
import { ReactNode } from 'react'
import { Icons } from '../icons'
import { buttonVariants } from '../ui/button'
import { Card, CardDescription, CardHeader, CardTitle } from '../ui/card'

export function AuthLayout({ children, title, desc }: { children: ReactNode; title: string; desc: string }) {
	return (
		<div className='min-h-screen bg-background relative flex flex-col sm:flex-row sm:items-center sm:justify-center p-4 sm:p-8 gap-4 sm:gap-0'>
			<div className='sm:absolute top-4 left-4 sm:top-8 sm:left-8'>
				<Link className={buttonVariants({ variant: 'ghost' })} href='/'>
					<Icons.chevronLeft />
					Back to Home
				</Link>
			</div>
			<div className='w-full sm:max-w-md'>
				<Card className='border-0 shadow-none sm:border sm:shadow-sm'>
					<CardHeader className='text-center'>
						<CardTitle className='text-2xl font-bold'>{title}</CardTitle>
						<CardDescription>{desc}</CardDescription>
					</CardHeader>
					{children}
				</Card>
			</div>
		</div>
	)
}
