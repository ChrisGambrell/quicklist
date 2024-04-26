'use client'

import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { TableCell, TableRow } from '@/components/ui/table'
import { Tables } from '@/db_types'
import { createClient } from '@/utils/supabase/client'
import { MoreHorizontalIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

export default function Rule({ rule }: { rule: Tables<'rules'> }) {
	const router = useRouter()

	async function deleteRule() {
		const supabase = createClient()

		const { error } = await supabase.from('rules').delete().eq('id', rule.id)
		if (error) return toast.error(error.message)

		toast.success('Rule deleted')
		router.refresh()
	}

	return (
		<TableRow>
			<TableCell className='font-medium truncate'>{rule.rule}</TableCell>
			<TableCell className='hidden md:table-cell'>{new Date(rule.created_at).toDateString()}</TableCell>
			<TableCell>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button aria-haspopup='true' size='icon' variant='ghost'>
							<MoreHorizontalIcon className='h-4 w-4' />
							<span className='sr-only'>Toggle menu</span>
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align='end'>
						<DropdownMenuLabel>Actions</DropdownMenuLabel>
						<DropdownMenuItem onClick={() => router.push(`/rules/${rule.id}/edit`)}>Edit</DropdownMenuItem>
						<DropdownMenuItem onClick={deleteRule}>Delete</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</TableCell>
		</TableRow>
	)
}
