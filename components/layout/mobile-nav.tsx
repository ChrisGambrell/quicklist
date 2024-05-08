import logo from '@/app/icon.png'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { User } from '@/utils/types'
import { PanelLeftIcon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { links } from './desktop-nav'
import MobileNavLink from './mobile-nav-link'
import UserMenu from './user-menu'

export default function MobileNav({ user }: { user: User }) {
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
						<Link href='/'>
							<Image className='rounded-lg' src={logo} alt='QuickList Logo' width={40} height={40} />
							<span className='sr-only'>QuickList</span>
						</Link>
						<UserMenu user={user} />
					</div>
					{links
						.filter((link) => !link.admin || user.is_admin)
						.map((link) => (
							<MobileNavLink key={link.href} {...link} />
						))}
				</nav>
			</SheetContent>
		</Sheet>
	)
}
