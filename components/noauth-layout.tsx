import Link from 'next/link'
import { ReactNode } from 'react'
import { LogoLink } from './logo'
import { buttonVariants } from './ui/button'

export default function NoAuthLayout({ action, children }: { action: { href: string; label: string }; children: ReactNode }) {
	return (
		<div className='flex min-h-[100dvh] flex-col'>
			<header className='flex items-center justify-between px-6 py-4'>
				<div className='flex items-center space-x-4'>
					<LogoLink size={36} />
					<Link className='text-lg font-bold tracking-tighter md:text-2xl lg:text-2xl xl:text-3xl' href='/'>
						QuickList
					</Link>
				</div>

				<div>
					<Link className={buttonVariants({ variant: 'secondary' })} href={action.href}>
						{action.label}
					</Link>
				</div>
			</header>

			<main className='w-full pt-4 md:pt-16 lg:pt-24'>{children}</main>
		</div>
	)
}
