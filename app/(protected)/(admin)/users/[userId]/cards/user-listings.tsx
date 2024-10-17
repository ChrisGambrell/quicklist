import { DataTable } from '@/components/data-table'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Prisma } from '@prisma/client'
import { listingColumns } from '../components/listing-columns'

export function UserListings({ listings }: { listings: Prisma.ListingGetPayload<{ include: { images: true } }>[] }) {
	return (
		<Card>
			<CardHeader>
				<div className='flex items-start justify-between'>
					<CardTitle>Listings</CardTitle>
				</div>
			</CardHeader>
			<CardContent>
				<DataTable
					columns={listingColumns}
					data={listings}
					defaultState={{ pageSize: 5, sorting: [{ id: 'created_at', desc: true }] }}
				/>
			</CardContent>
		</Card>
	)
}
