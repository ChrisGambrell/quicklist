import { deleteListing } from '@/actions/listing'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ActionButton } from '@/components/ui/f/action-button'
import { Prisma } from '@prisma/client'

export default function DeleteListing({
	listing,
}: {
	listing: Prisma.ListingGetPayload<{ include: { generations: true; images: true } }>
}) {
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
