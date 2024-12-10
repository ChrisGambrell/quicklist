import { deleteListing } from '@/actions/listing'
import { ConfirmDelete } from '@/components/confirm-delete'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Listing } from '@prisma/client'

export default function DeleteListing({ listingId }: { listingId: Listing['id'] }) {
	return (
		<Card>
			<CardHeader>
				<CardTitle>Delete Listing</CardTitle>
				<CardDescription>This cannot be reversed.</CardDescription>
			</CardHeader>
			<CardContent>
				<ConfirmDelete action={deleteListing.bind(null, { listingId })}>
					<Button className='w-full' variant='destructive'>
						Delete Listing
					</Button>
				</ConfirmDelete>
			</CardContent>
		</Card>
	)
}
