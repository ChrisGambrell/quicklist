'use client'

import { createClient } from '@/utils/supabase/client'
import { LogOutIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { DropdownMenuItem } from '../ui/dropdown-menu'

export default function SignOutButton() {
	const router = useRouter()

	async function signOut() {
		const supabase = createClient()

		const { error } = await supabase.auth.signOut()
		if (error) return toast.error(error.message)

		router.refresh()
	}

	return (
		<DropdownMenuItem onClick={signOut}>
			<LogOutIcon className='mr-2 h-4 w-4' />
			<span>Sign out</span>
		</DropdownMenuItem>
	)
}
