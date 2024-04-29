'use client'

import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Tables } from '@/db_types'
import { createClient } from '@/utils/supabase/client'
import { MoreHorizontalIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

export default function ListingActions({ listingId }: { listingId: Tables<'listings'>['id'] }) {
	const router = useRouter()

	async function deleteListing() {
		const supabase = createClient()

		const { error } = await supabase.from('listings').delete().eq('id', listingId)
		if (error) return toast.error(error.message)

		toast.success('Listing deleted')
		router.refresh()
	}

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button aria-haspopup='true' size='icon' variant='ghost'>
					<MoreHorizontalIcon className='h-4 w-4' />
					<span className='sr-only'>Toggle menu</span>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align='end'>
				<DropdownMenuLabel>Actions</DropdownMenuLabel>
				<DropdownMenuItem onClick={() => router.push(`/listings/${listingId}/edit`)}>Edit</DropdownMenuItem>
				<DropdownMenuItem onClick={deleteListing}>Delete</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	)
}
