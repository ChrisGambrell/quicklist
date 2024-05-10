'use client'

import { ColumnHeader } from '@/components/column-header'
import { Rule } from '@/utils/types'
import { ColumnDef } from '@tanstack/react-table'
import Link from 'next/link'

export const ruleColumns: ColumnDef<Rule>[] = [
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
]
