import { deleteListing } from '@/actions/listing'
import ActionButton from '@/components/action-button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Listing } from '@prisma/client'

export default function DeleteListing({ listingId }: { listingId: Listing['id'] }) {
	const useDeleteListing = deleteListing.bind(null, { listingId })

	return (
		<form action={useDeleteListing}>
			<Card>
				<CardHeader>
					<CardTitle>Delete Listing</CardTitle>
					<CardDescription>This cannot be reversed.</CardDescription>
				</CardHeader>
				<CardContent>
					<ActionButton className='w-full' size='sm' variant='destructive'>
						Delete Listing
					</ActionButton>
				</CardContent>
			</Card>
		</form>
	)
}
