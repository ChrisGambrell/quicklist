import { DataTable } from '@/components/data-table'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ListingWithGenerationsAndImages } from '@/utils/types'
import { columns } from '../components/columns'

export default function ListingGenerations({ listing }: { listing: ListingWithGenerationsAndImages }) {
	return (
		<Card>
			<CardHeader>
				<div className='flex items-start justify-between'>
					<CardTitle>Generations</CardTitle>
				</div>
			</CardHeader>
			<CardContent>
				<DataTable columns={columns} data={listing.generations} defaultState={{ sorting: [{ id: 'created_at', desc: true }] }} />
			</CardContent>
		</Card>
	)
}
