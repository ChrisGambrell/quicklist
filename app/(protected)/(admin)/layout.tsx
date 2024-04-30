import { getAuth } from '@/utils/_helpers'
import { getErrorRedirect } from '@/utils/helpers'
import { redirect } from 'next/navigation'
import { ReactNode } from 'react'

export default async function AdminLayout({ children }: { children: ReactNode }) {
	const { user } = await getAuth()
	if (!user.is_admin) redirect(getErrorRedirect('/', 'You are not authorized to view this page'))
	return children
}
