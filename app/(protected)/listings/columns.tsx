'use client'

import { deleteListing } from '@/actions/listing'
import { ColumnHeader } from '@/components/column-header'
import { ConfirmDelete } from '@/components/confirm-delete'
import { Button, buttonVariants } from '@/components/ui/button'
import { PLACEHOLDER_IMAGE } from '@/lib/constants'
import { cn, getImageUrl } from '@/lib/utils'
import { Prisma } from '@prisma/client'
import { ColumnDef } from '@tanstack/react-table'
import { EditIcon, Trash2Icon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

type ColType = Prisma.ListingGetPayload<{ include: { images: true } }>

export const columns: ColumnDef<ColType>[] = [
	{
		id: 'image',
		cell: ({ row }) => (
			<Image
				src={row.original.images.length ? getImageUrl(row.original.images[0].imagePath) : PLACEHOLDER_IMAGE}
				alt='Listing image'
				className='aspect-square rounded-md object-cover'
				height={64}
				width={64}
			/>
		),
		meta: { className: 'hidden sm:table-cell min-w-[100px]' },
	},
	{
		accessorKey: 'title',
		header: ({ column }) => <ColumnHeader column={column} title='Title' />,
		cell: ({ getValue, row }) => (
			<Link className='line-clamp-1 hover:underline' href={`/listings/${row.original.id}/edit`}>
				{getValue<ColType['title']>() ?? '-'}
			</Link>
		),
		meta: { cellClassName: 'font-medium w-[99%] break-all' },
	},
	{
		accessorKey: 'price',
		header: ({ column }) => <ColumnHeader column={column} title='Price' />,
		cell: ({ getValue }) => getValue() ?? '-',
		meta: { className: 'hidden md:table-cell whitespace-nowrap' },
	},
	{
		accessorKey: 'createdAt',
		header: ({ column }) => <ColumnHeader column={column} title='Created at' />,
		cell: ({ getValue }) => new Date(getValue<ColType['createdAt']>()).toDateString(),
		meta: { className: 'hidden md:table-cell whitespace-nowrap' },
	},
	{
		id: 'actions',
		header: () => <span className='sr-only'>Actions</span>,
		cell: ({ row }) => (
			<div className='flex gap-1'>
				<Link
					className={cn(buttonVariants({ variant: 'outline', className: 'size-6 p-0' }))}
					href={`/listings/${row.original.id}/edit`}>
					<EditIcon className='size-4' />
				</Link>
				<ConfirmDelete action={deleteListing.bind(null, { listingId: row.original.id })}>
					<Button className='size-6 p-0' variant='outline'>
						<Trash2Icon className='size-4' />
					</Button>
				</ConfirmDelete>
			</div>
		),
	},
]
