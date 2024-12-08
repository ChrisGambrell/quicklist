import { auth } from '@/lib/auth'
import { getErrorRedirect, LayoutProps } from '@cgambrell/utils'
import { redirect } from 'next/navigation'

export default async function AdminLayout({ children }: LayoutProps) {
	const user = await auth()
	if (!user.isAdmin) redirect(getErrorRedirect('/', 'You are not authorized to view this page'))
	return children
}
