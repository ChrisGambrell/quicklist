'use client'

import { cn } from '@/lib/utils'
import { NavLinkProps } from '@/utils/types'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useMemo } from 'react'

export default function MobileNavLink({ exact = false, href, icon, label }: NavLinkProps) {
	const pathname = usePathname()

	const isActive = useMemo(() => {
		if (exact) return pathname === href
		return pathname.startsWith(href)
	}, [exact, href, pathname])

	return (
		<Link
			href={href}
			className={cn('flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground', { 'text-foreground': isActive })}>
			{icon}
			{label}
		</Link>
	)
}
