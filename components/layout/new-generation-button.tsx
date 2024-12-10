'use client'

import { PlusIcon } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { buttonVariants } from '../ui/button'

export default function NewGenerationButton() {
	const pathname = usePathname()

	if (pathname === '/listings') return null
	return (
		<Link className={buttonVariants()} href='/listings'>
			<PlusIcon />
			<span>New generation</span>
		</Link>
	)
}
