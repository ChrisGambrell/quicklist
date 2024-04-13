import SignOutButton from '@/app/(protected)/components/sign-out-button'
import NavLink from '@/components/nav-link'
import { getAuth } from '@/utils/helpers/server'
import { ReactNode } from 'react'

export default async function ProtectedLayout({ children }: { children: ReactNode }) {
	await getAuth()

	return (
		<div className='max-w-4xl p-2 sm:mx-auto sm:my-8 grid gap-8'>
			<div className='w-full flex items-center justify-between sm:justify-normal sm:space-x-8'>
				<NavLink href='/'>Listings</NavLink>
				<NavLink href='/settings'>Settings</NavLink>
				<SignOutButton />
			</div>
			{children}
		</div>
	)
}
