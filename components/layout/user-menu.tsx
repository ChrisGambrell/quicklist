import { logout } from '@/actions/auth'
import { auth } from '@/lib/auth'
import { PLACEHOLDER_AVATAR } from '@/lib/constants'
import { cn } from '@/lib/utils'
import {
	CircleDollarSignIcon,
	ClockIcon,
	HistoryIcon,
	LockKeyholeIcon,
	LogOutIcon,
	LucideIcon,
	ScaleIcon,
	SettingsIcon,
	UserIcon,
	Users2Icon,
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { Button, buttonVariants } from '../ui/button'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '../ui/dropdown-menu'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip'

export default async function UserMenu() {
	const user = await auth()
	// const credits = await getRemainingCredits()

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant='outline' size='icon' className='overflow-hidden rounded-full'>
					<Image
						src={user.image ?? PLACEHOLDER_AVATAR}
						alt='User avatar'
						className='overflow-hidden rounded-full object-cover w-full h-full'
						width={40}
						height={40}
					/>
				</Button>
			</DropdownMenuTrigger>

			<DropdownMenuContent className='w-80 mr-4'>
				<div className='flex items-center text-sm px-2 py-1'>
					<div>
						<div>{user.name}</div>
						<div className='text-xs text-foreground/80'>{user.email}</div>
					</div>
					<div className='ml-auto'>
						<TooltipProvider delayDuration={0}>
							<Tooltip>
								<TooltipTrigger>
									<Link className={cn(buttonVariants({ variant: 'outline' }), 'h-6 rounded-full px-2')} href='/pricing'>
										<ClockIcon className='w-4 h-4 mr-1.5' />
										{/* TODO: Remaining credits */}
										{/* <span>{credits}</span> */}
									</Link>
								</TooltipTrigger>
								{/* TODO: Remaining credits */}
								<TooltipContent>You have TODO remaining credits</TooltipContent>
							</Tooltip>
						</TooltipProvider>
					</div>
				</div>

				<DropdownMenuSeparator />
				<DropdownMenuGroup>
					<DropdownLink href='/listings' icon={HistoryIcon} label='History' />
					<DropdownLink href='/rules' icon={ScaleIcon} label='Rules' />
					{user.isAdmin && <DropdownLink href='/users' icon={Users2Icon} label='Users' />}
				</DropdownMenuGroup>
				<DropdownMenuSeparator />
				<DropdownMenuGroup>
					<DropdownLink href='/pricing' icon={CircleDollarSignIcon} label='Pricing' />
				</DropdownMenuGroup>
				<DropdownMenuSeparator />
				<DropdownMenuGroup>
					<DropdownLink href='/settings' icon={UserIcon} label='Profile' />
					<DropdownLink href='/settings/password' icon={LockKeyholeIcon} label='Password' />
					<DropdownLink href='/settings' icon={SettingsIcon} label='Settings' />
				</DropdownMenuGroup>
				<DropdownMenuSeparator />
				<form action={logout}>
					<DropdownMenuItem>
						<button className='w-full flex items-center'>
							<LogOutIcon className='mr-2 h-4 w-4' />
							<span>Sign out</span>
						</button>
					</DropdownMenuItem>
				</form>
			</DropdownMenuContent>
		</DropdownMenu>
	)
}

function DropdownLink({ disabled, href, icon: Icon, label }: { disabled?: boolean; href: string; icon: LucideIcon; label: string }) {
	if (disabled)
		return (
			<DropdownMenuItem disabled>
				<Icon className='mr-2 h-4 w-4' />
				<span>{label}</span>
			</DropdownMenuItem>
		)

	return (
		<Link href={href}>
			<DropdownMenuItem>
				<Icon className='mr-2 h-4 w-4' />
				<span>{label}</span>
			</DropdownMenuItem>
		</Link>
	)
}
