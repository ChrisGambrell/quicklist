'use client'

import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { DropdownMenuItem } from '../ui/dropdown-menu'

export default function SignOutButton() {
	const router = useRouter()

	async function signOut() {
		const supabase = createClient()

		const { error } = await supabase.auth.signOut()
		if (error) return toast.error(error.message)

		router.push('/sign-in')
	}

	return <DropdownMenuItem onClick={signOut}>Sign out</DropdownMenuItem>
}
