import { Button } from '@/components/ui/button'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Tables } from '@/db_types'
import Link from 'next/link'
import SignOutButton from './sign-out-button'

export default function UserMenu({ user }: { user: Tables<'users'> }) {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant='outline' size='icon' className='overflow-hidden rounded-full'>
					{/* TODO: Use Image component */}
					<img
						src={user.avatar_url ?? 'https://ui.shadcn.com/_next/image?url=%2Fplaceholder-user.jpg&w=96&q=75'}
						width={36}
						height={36}
						alt='Avatar'
						className='overflow-hidden rounded-full'
					/>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align='end'>
				<DropdownMenuLabel>My Account</DropdownMenuLabel>
				<DropdownMenuSeparator />
				<DropdownMenuItem asChild>
					<Link href='/settings'>Settings</Link>
				</DropdownMenuItem>
				<SignOutButton />
			</DropdownMenuContent>
		</DropdownMenu>
	)
}
