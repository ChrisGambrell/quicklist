import logo from '@/app/icon.png'
import { User } from '@/utils/types'
import { HistoryIcon, MessageCircleIcon, ScaleIcon, SettingsIcon, UsersIcon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import NavLink from './nav-link'
import UserMenu from './user-menu'

export const links = [
	{ href: '/', exact: true, icon: <MessageCircleIcon className='w-5 h-5' />, label: 'Chat' },
	{ href: '/listings', icon: <HistoryIcon className='w-5 h-5' />, label: 'Listings' },
	{ href: '/rules', icon: <ScaleIcon className='w-5 h-5' />, label: 'Rules' },
	{ href: '/users', admin: true, icon: <UsersIcon className='w-5 h-5' />, label: 'Users' },
	{ href: '/settings', icon: <SettingsIcon className='w-5 h-5' />, label: 'Settings' },
]

export default function DesktopNav({ user }: { user: User }) {
	return (
		<aside className='fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex'>
			<nav className='flex flex-col items-center gap-4 px-2 sm:py-5'>
				<Link href='/'>
					<Image className='rounded-lg' src={logo} alt='QuickList Logo' width={36} height={36} />
					<span className='sr-only'>QuickList</span>
				</Link>
				{links
					.filter((link) => !link.admin || user.is_admin)
					.map((link) => (
						<NavLink key={link.href} {...link} />
					))}
			</nav>
			<nav className='mt-auto flex flex-col items-center gap-4 px-2 sm:py-5'>
				<UserMenu user={user} />
			</nav>
		</aside>
	)
}
