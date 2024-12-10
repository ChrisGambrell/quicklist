'use client'

import { ColumnHeader } from '@/components/column-header'
import { Generation } from '@prisma/client'
import { ColumnDef } from '@tanstack/react-table'

export const columns: ColumnDef<Generation>[] = [
	{
		accessorKey: 'createdAt',
		header: ({ column }) => <ColumnHeader column={column} title='Created at' />,
		cell: ({ getValue }) => new Date(getValue<Generation['createdAt']>()).toDateString(),
	},
	{
		accessorKey: 'credits',
		header: ({ column }) => <ColumnHeader column={column} title='Credits used' />,
	},
]
