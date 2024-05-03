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
import { PLACEHOLDER_AVATAR } from '@/utils/constants'
import { User } from '@/utils/types'
import Image from 'next/image'
import Link from 'next/link'
import SignOutButton from './sign-out-button'

export default async function UserMenu({ user }: { user: User }) {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant='outline' size='icon' className='overflow-hidden rounded-full'>
					<Image
						src={user.avatar_url ?? PLACEHOLDER_AVATAR}
						alt='User avatar'
						className='overflow-hidden rounded-full'
						width={36}
						height={36}
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
