import { auth } from '@/lib/auth'
import { LayoutProps } from '@cgambrell/utils'
import { redirect } from 'next/navigation'

export default async function NoAuthLayout({ children }: LayoutProps) {
	const user = await auth()

	if (!!user) redirect('/listings')
	return children
}
