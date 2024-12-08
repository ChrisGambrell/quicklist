import { auth } from '@/lib/auth'
import { getErrorRedirect } from '@cgambrell/utils'
import { redirect } from 'next/navigation'
import { ReactNode } from 'react'

export default async function AdminLayout({ children }: { children: ReactNode }) {
	const user = await auth()
	if (!user.isAdmin) redirect(getErrorRedirect('/', 'You are not authorized to view this page'))
	return children
}
