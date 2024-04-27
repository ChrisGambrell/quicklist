import DesktopNav from '@/components/layout/desktop-nav'
import MobileNav from '@/components/layout/mobile-nav'
import { getAuth } from '@/utils/helpers'
import { ReactNode } from 'react'

export default async function ProtectedLayout({ children }: { children: ReactNode }) {
	await getAuth()

	return (
		<div className='flex min-h-screen w-full flex-col bg-muted/40'>
			<DesktopNav />

			<div className='flex flex-col sm:gap-4 sm:py-4 sm:pl-14'>
				<header className='sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6'>
					<MobileNav />
					{/* <Breadcrumbs /> */}
					{/* <SiteSearch /> */}
				</header>
				<main className='grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0'>{children}</main>
			</div>
		</div>
	)
}
