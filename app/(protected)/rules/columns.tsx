'use client'

import { ColumnHeader } from '@/components/column-header'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Rule } from '@/utils/types'
import { ColumnDef } from '@tanstack/react-table'
import { MoreHorizontalIcon } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export const columns: ColumnDef<Rule>[] = [
	{
		accessorKey: 'rule',
		header: ({ column }) => <ColumnHeader column={column} title='Rule' />,
		cell: ({ getValue, row }) => (
			<Link className='line-clamp-1 hover:underline' href={`/rules/${row.original.id}/edit`}>
				{getValue<Rule['rule']>() ?? '-'}
			</Link>
		),
		meta: { cellClassName: 'font-medium w-[99%] break-all' },
	},
	{
		accessorKey: 'created_at',
		header: ({ column }) => <ColumnHeader column={column} title='Created at' />,
		cell: ({ getValue }) => new Date(getValue<Rule['created_at']>()).toDateString(),
		meta: { className: 'hidden md:table-cell whitespace-nowrap' },
	},
	{
		id: 'actions',
		header: () => <span className='sr-only'>Actions</span>,
		cell: ({ row }) => <Actions ruleId={row.original.id} />,
		meta: { className: 'whitespace-nowrap' },
	},
]

export default function Actions({ ruleId }: { ruleId: Rule['id'] }) {
	const router = useRouter()

	// async function deleteRule() {
	// 	const supabase = createClient()

	// 	const { error } = await supabase.from('rules').delete().eq('id', ruleId)
	// 	if (error) return toast.error(error.message)

	// 	toast.success('Rule deleted')
	// 	router.refresh()
	// }

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
				<DropdownMenuItem onClick={() => router.push(`/rules/${ruleId}/edit`)}>Edit</DropdownMenuItem>
				{/* TODO: Delete rule */}
				<DropdownMenuItem>Delete</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	)
}
