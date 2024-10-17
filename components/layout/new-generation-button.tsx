'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { buttonVariants } from '../ui/button'

export function NewGenerationButton() {
	const pathname = usePathname()

	if (pathname === '/listings') return null
	return (
		<Link className={buttonVariants({ className: 'h-9', size: 'sm' })} href='/listings'>
			New<span className='ml-1 hidden sm:block'>Generation</span>
		</Link>
	)
}
