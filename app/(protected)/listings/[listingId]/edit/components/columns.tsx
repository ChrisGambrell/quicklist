'use client'

import { ColumnHeader } from '@/components/column-header'
import { Generation } from '@/utils/types'
import { ColumnDef } from '@tanstack/react-table'

export const columns: ColumnDef<Generation>[] = [
	{
		accessorKey: 'created_at',
		header: ({ column }) => <ColumnHeader column={column} title='Created at' />,
		cell: ({ getValue }) => new Date(getValue<Generation['created_at']>()).toDateString(),
	},
	{
		accessorKey: 'credits',
		header: ({ column }) => <ColumnHeader column={column} title='Credits used' />,
	},
]
