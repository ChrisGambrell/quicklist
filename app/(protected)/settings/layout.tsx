import { ReactNode } from 'react'
import NavLink from './nav-link'

export default function SettingsLayout({ children }: { children: ReactNode }) {
	return (
		<div className='mx-auto grid max-w-[59rem] flex-1 auto-rows-max gap-6 w-full'>
			<div className='mx-auto grid w-full max-w-6xl gap-2'>
				<h1 className='text-3xl font-semibold'>Settings</h1>
			</div>
			<div className='mx-auto grid w-full max-w-6xl items-start gap-6 md:grid-cols-[180px_1fr] lg:grid-cols-[250px_1fr]'>
				<nav className='grid gap-4 text-sm text-muted-foreground'>
					<NavLink exact href='/settings'>
						Profile
					</NavLink>
					<NavLink href='/settings/subscription'>Subscription</NavLink>
					<NavLink href='/settings/password'>Password</NavLink>
				</nav>
				<div className='grid gap-6'>{children}</div>
			</div>
		</div>
	)
}
