import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Tables } from '@/db_types'
import { Package2Icon, PanelLeftIcon } from 'lucide-react'
import Link from 'next/link'
import { links } from './desktop-nav'
import MobileNavLink from './mobile-nav-link'
import UserMenu from './user-menu'

export default function MobileNav({ user }: { user: Tables<'users'> }) {
	return (
		<Sheet>
			<SheetTrigger asChild>
				<Button size='icon' variant='outline' className='sm:hidden'>
					<PanelLeftIcon className='h-5 w-5' />
					<span className='sr-only'>Toggle Menu</span>
				</Button>
			</SheetTrigger>
			<SheetContent side='left' className='sm:max-w-xs'>
				<nav className='grid gap-6 text-lg font-medium'>
					<div className='flex justify-between pr-6'>
						<Link
							href='/'
							className='group flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:text-base'>
							<Package2Icon className='h-5 w-5 transition-all group-hover:scale-110' />
							<span className='sr-only'>eBay Lister</span>
						</Link>
						<UserMenu user={user} />
					</div>
					{links.map((link) => (
						<MobileNavLink key={link.href} {...link} />
					))}
				</nav>
			</SheetContent>
		</Sheet>
	)
}
