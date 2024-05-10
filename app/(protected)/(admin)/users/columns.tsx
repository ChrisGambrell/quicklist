'use client'

import { ColumnHeader } from '@/components/column-header'
import { PLACEHOLDER_AVATAR } from '@/utils/constants'
import { UserWithGenerationsAndPurchases } from '@/utils/types'
import { ColumnDef } from '@tanstack/react-table'
import Image from 'next/image'
import Link from 'next/link'

export const columns: ColumnDef<UserWithGenerationsAndPurchases>[] = [
	{
		accessorKey: 'avatar_url',
		header: '',
		cell: ({ getValue }) => (
			<Image
				src={getValue<UserWithGenerationsAndPurchases['avatar_url']>() ?? PLACEHOLDER_AVATAR}
				alt='Listing image'
				className='aspect-square rounded-md object-cover'
				height={64}
				width={64}
			/>
		),
		meta: { className: 'min-w-[64] sm:min-w-[100px] sm:table-cell' },
	},
	{
		accessorKey: 'full_name',
		header: ({ column }) => <ColumnHeader column={column} title='Name' />,
		cell: ({ getValue, row }) => (
			<Link className='hover:underline' href={`/users/${row.original.id}`}>
				{getValue<UserWithGenerationsAndPurchases['full_name']>()}
			</Link>
		),
		meta: { cellClassName: (row: UserWithGenerationsAndPurchases) => (row.is_admin ? 'font-black' : 'font-medium') },
	},
	{
		id: 'purchased',
		accessorFn: (row) => row.purchases.reduce((prev, curr) => prev + curr.price.product.product_amount.credits, 0),
		header: ({ column }) => <ColumnHeader column={column} title='Purchased' />,
	},
	{
		id: 'used',
		accessorFn: (row) => row.generations.reduce((prev, curr) => prev + curr.credits, 0),
		header: ({ column }) => <ColumnHeader column={column} title='Used' />,
	},
	{
		accessorKey: 'email',
		header: ({ column }) => <ColumnHeader column={column} title='Email' />,
		meta: { className: 'hidden lg:table-cell' },
	},
	{
		accessorKey: 'created_at',
		header: ({ column }) => <ColumnHeader column={column} title='Created at' />,
		cell: ({ getValue }) => new Date(getValue<UserWithGenerationsAndPurchases['created_at']>()).toDateString(),
		meta: { className: 'hidden md:table-cell' },
	},
]
