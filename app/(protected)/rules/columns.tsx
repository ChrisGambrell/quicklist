'use client'

import { deleteRule } from '@/actions/rule'
import { ColumnHeader } from '@/components/column-header'
import { ConfirmDelete } from '@/components/confirm-delete'
import { Button } from '@/components/ui/button'
import { UpsertRule } from '@/components/upsert-rule'
import { Rule } from '@prisma/client'
import { ColumnDef } from '@tanstack/react-table'
import { EditIcon, Trash2Icon } from 'lucide-react'

export const columns: ColumnDef<Rule>[] = [
	{
		accessorKey: 'rule',
		header: ({ column }) => <ColumnHeader column={column} title='Rule' />,
		cell: ({ getValue }) => getValue<Rule['rule']>() ?? '-',
		meta: { cellClassName: 'font-medium w-[99%] break-all' },
	},
	{
		accessorKey: 'createdAt',
		header: ({ column }) => <ColumnHeader column={column} title='Created at' />,
		cell: ({ getValue }) => new Date(getValue<Rule['createdAt']>()).toDateString(),
		meta: { className: 'hidden md:table-cell whitespace-nowrap' },
	},
	{
		id: 'actions',
		header: () => <span className='sr-only'>Actions</span>,
		cell: ({ row }) => (
			<div className='flex gap-1'>
				<UpsertRule rule={row.original}>
					<Button className='size-6 p-0' variant='outline'>
						<EditIcon className='size-4' />
					</Button>
				</UpsertRule>
				<ConfirmDelete action={deleteRule.bind(null, { ruleId: row.original.id })}>
					<Button className='size-6 p-0' variant='outline'>
						<Trash2Icon className='size-4' />
					</Button>
				</ConfirmDelete>
			</div>
		),
	},
]
