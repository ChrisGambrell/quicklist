'use client'

import { cn } from '@/lib/utils'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ReactNode, useMemo } from 'react'

export function NavLink({ children, exact = false, href }: { children: ReactNode; exact?: boolean; href: string }) {
	const pathname = usePathname()

	const isActive = useMemo(() => {
		if (exact) return pathname === href
		return pathname.startsWith(href)
	}, [exact, href, pathname])

	return (
		<Link href={href} className={cn({ 'font-semibold text-primary': isActive })}>
			{children}
		</Link>
	)
}
