import { DataTable } from '@/components/data-table'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ListingWithImages } from '@/utils/types'
import { columns } from '../components/columns'

export default function UserListings({ listings }: { listings: ListingWithImages[] }) {
	return (
		<Card>
			<CardHeader>
				<div className='flex items-start justify-between'>
					<CardTitle>Listings</CardTitle>
				</div>
			</CardHeader>
			<CardContent>
				<DataTable columns={columns} data={listings} defaultState={{ pageSize: 10, sorting: [{ id: 'created_at', desc: true }] }} />
			</CardContent>
		</Card>
	)
}
