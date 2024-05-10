'use client'

import { ColumnHeader } from '@/components/column-header'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { PLACEHOLDER_IMAGE } from '@/utils/constants'
import { getImageUrl } from '@/utils/helpers'
import { createClient } from '@/utils/supabase/client'
import { Listing, ListingWithImages } from '@/utils/types'
import { ColumnDef } from '@tanstack/react-table'
import { MoreHorizontalIcon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

export const columns: ColumnDef<ListingWithImages>[] = [
	{
		id: 'image',
		cell: ({ row }) => (
			<Image
				src={row.original.images.length ? getImageUrl(row.original.images[0].image_path) : PLACEHOLDER_IMAGE}
				alt='Listing image'
				className='aspect-square rounded-md object-cover'
				height={64}
				width={64}
			/>
		),
		meta: { className: 'hidden sm:table-cell min-w-[75px]' },
	},
	{
		accessorKey: 'title',
		header: ({ column }) => <ColumnHeader column={column} title='Title' />,
		cell: ({ getValue, row }) => (
			<Link className='line-clamp-1 hover:underline' href={`/listings/${row.original.id}/edit`}>
				{getValue<ListingWithImages['title']>() ?? '-'}
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
		accessorKey: 'created_at',
		header: ({ column }) => <ColumnHeader column={column} title='Created at' />,
		cell: ({ getValue }) => new Date(getValue<ListingWithImages['created_at']>()).toDateString(),
		meta: { className: 'hidden md:table-cell whitespace-nowrap' },
	},
	{
		id: 'actions',
		header: () => <span className='sr-only'>Actions</span>,
		cell: ({ row }) => <Actions listingId={row.original.id} />,
		meta: { className: 'whitespace-nowrap' },
	},
]

function Actions({ listingId }: { listingId: Listing['id'] }) {
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
