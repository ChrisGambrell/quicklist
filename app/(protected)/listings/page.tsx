import { DataTable } from '@/components/data-table'
import { auth } from '@/lib/auth'
import prisma from '@/lib/db'
import { cn } from '@/lib/utils'
import { Metadata } from 'next'
import ChatImageUpload from '../chat-image-upload'
import { columns } from './columns'

export const metadata: Metadata = {
	title: 'QuickList - Listings',
	description: 'List of listings and their images and generations',
}

export const maxDuration = 300

export default async function ListingsPage() {
	const user = await auth()
	const listings = await prisma.listing.findMany({
		where: { userId: user.id },
		include: { generations: { orderBy: { createdAt: 'desc' } }, images: { orderBy: { isPrimary: 'desc' } } },
		orderBy: { createdAt: 'desc' },
	})

	return (
		<div className={cn('container grid gap-4', { 'pt-4 sm:pt-8 lg:pt-16 xl:pt-20': !listings || listings.length === 0 })}>
			<ChatImageUpload />

			{listings && listings.length > 0 && (
				<DataTable columns={columns} data={listings} defaultState={{ pageSize: 5, sorting: [{ id: 'created_at', desc: true }] }} />
			)}
		</div>
	)
}
