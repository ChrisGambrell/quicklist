import { DataTable } from '@/components/data-table'
import prisma from '@/lib/db'
import { Metadata } from 'next'
import { columns } from './columns'

// TODO: Metadata for all pages
export const metadata: Metadata = {
	title: 'QuickList - Users',
	description: 'List of users and their purchases and credits',
}

export default async function UsersPage() {
	const users = await prisma.user.findMany({
		include: { generations: true, purchases: { include: { price: { include: { product: true } } } } },
		orderBy: { createdAt: 'desc' },
	})

	return (
		<div className='container'>
			<DataTable
				columns={columns}
				data={users}
				defaultState={{
					pageSize: 10,
					sorting: [
						{ id: 'purchased', desc: true },
						{ id: 'used', desc: true },
					],
				}}
			/>
		</div>
	)
}
