import { LayoutProps } from '@cgambrell/utils'
import { Metadata } from 'next'
import { NavLink } from './nav-link'

export const metadata: Metadata = {
	title: 'QuickList - Settings',
	description: 'User settings and profile information',
}

export default function SettingsLayout({ children }: LayoutProps) {
	return (
		<div className='mx-auto max-w-[59rem] grid items-start gap-6 md:grid-cols-[180px_1fr] lg:grid-cols-[250px_1fr]'>
			<nav className='grid gap-4 text-sm text-muted-foreground'>
				<NavLink exact href='/settings'>
					Profile
				</NavLink>
				<NavLink href='/settings/password'>Password</NavLink>
			</nav>
			<div className='grid gap-6'>{children}</div>
		</div>
	)
}
