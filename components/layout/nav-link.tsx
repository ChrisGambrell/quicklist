'use client'

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { cn, NavLinkProps } from '@/lib/utils'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useMemo } from 'react'

export function NavLink({ exact = false, href, icon, label }: NavLinkProps) {
	const pathname = usePathname()

	const isActive = useMemo(() => {
		if (exact) return pathname === href
		return pathname.startsWith(href)
	}, [exact, href, pathname])

	return (
		<TooltipProvider key={href}>
			<Tooltip>
				<TooltipTrigger asChild>
					<Link
						href={href}
						className={cn(
							'flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8',
							{ 'bg-accent text-accent-foreground': isActive }
						)}>
						{icon}
						<span className='sr-only'>{label}</span>
					</Link>
				</TooltipTrigger>
				<TooltipContent side='right'>{label}</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	)
}
