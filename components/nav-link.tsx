import { cn } from '@/lib/utils'
import Link from 'next/link'
import { ReactNode } from 'react'

// TODO: Delete this component
export default function NavLink({ className, ...props }: { children: ReactNode; className?: string; href: string }) {
	return <Link {...props} className={cn('font-medium text-primary hover:underline', className)} />
}
