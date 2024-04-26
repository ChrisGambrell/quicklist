import { HomeIcon, Package2Icon, ScaleIcon, SettingsIcon } from 'lucide-react'
import Link from 'next/link'
import NavLink from './nav-link'

export const links = [
	[
		// TODO: Fix back to /listings
		{ href: '/listings', exact: true, icon: <HomeIcon className='w-5 h-5' />, label: 'Dashboard' },
		{ href: '/rules', icon: <ScaleIcon className='w-5 h-5' />, label: 'Rules' },
	],
	[{ href: '/settings', icon: <SettingsIcon className='w-5 h-5' />, label: 'Settings' }],
]

export default function DesktopNav() {
	return (
		<aside className='fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex'>
			<nav className='flex flex-col items-center gap-4 px-2 sm:py-5'>
				<Link
					href='/'
					className='group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base'>
					<Package2Icon className='h-4 w-4 transition-all group-hover:scale-110' />
					<span className='sr-only'>eBay Lister</span>
				</Link>
				{links[0].map((link) => (
					<NavLink key={link.href} {...link} />
				))}
			</nav>
			<nav className='mt-auto flex flex-col items-center gap-4 px-2 sm:py-5'>
				{links[1].map((link) => (
					<NavLink key={link.href} {...link} />
				))}
			</nav>
		</aside>
	)
}
