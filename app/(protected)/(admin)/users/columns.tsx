'use client'

import { ColumnHeader } from '@/components/column-header'
import { PLACEHOLDER_AVATAR } from '@/utils/constants'
import { Prisma } from '@prisma/client'
import { ColumnDef } from '@tanstack/react-table'
import Image from 'next/image'
import Link from 'next/link'

type ColType = Prisma.UserGetPayload<{
	include: { generations: true; purchases: { include: { price: { include: { product: { include: { amount: true } } } } } } }
}>

export const columns: ColumnDef<ColType>[] = [
	{
		accessorKey: 'image',
		header: '',
		cell: ({ getValue }) => (
			<Image
				src={getValue<ColType['image']>() ?? PLACEHOLDER_AVATAR}
				alt='Listing image'
				className='aspect-square rounded-md object-cover'
				height={64}
				width={64}
			/>
		),
		meta: { className: 'min-w-[64] sm:min-w-[100px] sm:table-cell' },
	},
	{
		accessorKey: 'name',
		header: ({ column }) => <ColumnHeader column={column} title='Name' />,
		cell: ({ getValue, row }) => (
			<Link className='hover:underline' href={`/users/${row.original.id}`}>
				{getValue<ColType['name']>()}
			</Link>
		),
		meta: { cellClassName: (row: ColType) => (row.isAdmin ? 'font-black' : 'font-medium') },
	},
	{
		id: 'purchased',
		accessorFn: (row) => row.purchases.reduce((prev, curr) => prev + (curr.price.product.amount?.credits ?? 0), 0),
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
		accessorKey: 'createdAt',
		header: ({ column }) => <ColumnHeader column={column} title='Created at' />,
		cell: ({ getValue }) => new Date(getValue<ColType['createdAt']>()).toDateString(),
		meta: { className: 'hidden md:table-cell' },
	},
]
