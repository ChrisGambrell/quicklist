import { deleteListing } from '@/actions/listing'
import ActionButton from '@/components/action-button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ListingWithGenerationsAndImages } from '@/utils/types'

export default function DeleteListing({ listing }: { listing: ListingWithGenerationsAndImages }) {
	const useDeleteListing = deleteListing.bind(null, { listingId: listing.id })

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
