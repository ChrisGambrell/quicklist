'use client'

import { cn } from '@/lib/utils'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ReactNode, useMemo } from 'react'

type NavLinkProps = {
	exact?: boolean
	href: string
	icon: ReactNode
	label: string
}

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
