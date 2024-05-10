import { cn } from '@/lib/utils'
import { getAuth, getRemainingCredits } from '@/utils/_helpers'
import { PLACEHOLDER_AVATAR } from '@/utils/constants'
import {
	CircleDollarSignIcon,
	ClockIcon,
	HistoryIcon,
	LockKeyholeIcon,
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
import SignOutButton from './sign-out-button'

export default async function UserMenu() {
	const { user } = await getAuth()
	const credits = await getRemainingCredits()

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant='outline' size='icon' className='overflow-hidden rounded-full'>
					<Image
						src={user.avatar_url ?? PLACEHOLDER_AVATAR}
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
						<div>{user.full_name}</div>
						<div className='text-xs text-foreground/80'>{user.email}</div>
					</div>
					<div className='ml-auto'>
						<TooltipProvider delayDuration={0}>
							<Tooltip>
								<TooltipTrigger>
									<Link className={cn(buttonVariants({ variant: 'outline' }), 'h-6 rounded-full px-2')} href='/pricing'>
										<ClockIcon className='w-4 h-4 mr-1.5' />
										<span>{credits}</span>
									</Link>
								</TooltipTrigger>
								<TooltipContent>You have {credits} remaining credits</TooltipContent>
							</Tooltip>
						</TooltipProvider>
					</div>
				</div>

				<DropdownMenuSeparator />
				<DropdownMenuGroup>
					<DropdownLink href='/listings' icon={HistoryIcon} label='History' />
					<DropdownLink href='/rules' icon={ScaleIcon} label='Rules' />
					{user.is_admin && <DropdownLink href='/users' icon={Users2Icon} label='Users' />}
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
				<SignOutButton />
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
