'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useMemo } from 'react'
import { LogoLink } from '../logo'

export default function Header() {
	const pathname = usePathname()

	const routeTitle = useMemo(() => {
		const routes: { pattern: RegExp; description: string }[] = [
			{
				pattern: /^\/listings(\/([a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}))?(\/edit)?$/,
				description: pathname.includes('edit') ? 'Edit Listing' : 'Listings',
			},
			{ pattern: /^\/pricing$/, description: 'Pricing' },
			{
				pattern: /^\/rules(\/([a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}))?(\/edit)?$/,
				description: pathname.includes('edit') ? 'Edit Rule' : 'Rules',
			},
			{ pattern: /^\/settings(\/password)?$/, description: pathname.includes('password') ? 'Change Password' : 'Settings' },
			{ pattern: /^\/users$/, description: 'Users' },
		]

		for (const route of routes) if (route.pattern.test(pathname)) return route.description
		return null
	}, [pathname])

	return (
		<div className='flex items-center space-x-4'>
			<LogoLink size={36} />
			<Link className='text-lg font-bold tracking-tighter md:text-2xl lg:text-2xl xl:text-3xl' href='/'>
				QuickList
			</Link>
			{routeTitle && (
				<>
					<div className='text-xs sm:text-base'>/</div>
					<div className='text-sm sm:text-lg'>{routeTitle}</div>
				</>
			)}
		</div>
	)
}
