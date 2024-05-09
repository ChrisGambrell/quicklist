import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { ReactNode } from 'react'

export default async function NoAuthLayout({ children }: { children: ReactNode }) {
	const supabase = createClient()
	const {
		data: { user },
	} = await supabase.auth.getUser()

	if (!!user) redirect('/listings')
	return children
}
