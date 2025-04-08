import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ActionButton } from '@/components/ui/f/action-button'
import { requiredCredits } from '@/utils/helpers'
import { Prisma } from '@prisma/client'

export default function GenerateDetails({
	listing,
}: {
	listing: Prisma.ListingGetPayload<{ include: { generations: true; images: true } }>
}) {
	// TODO: generateListingData
	// const useGenerateData = generateListingData.bind(null, { listingId: listing.id })

	return (
		// TODO: action
		<form>
			<Card>
				<CardHeader>
					<CardTitle>Generate Listing Data</CardTitle>
					<CardDescription>Generate the listing&apos;s data based on its details and images.</CardDescription>
				</CardHeader>
				<CardContent>
					<ActionButton className='w-full' disabled={!listing.images.length} size='sm' variant='secondary'>
						Generate
						{listing.images.length
							? ` (${requiredCredits(listing.images.length)} credit${requiredCredits(listing.images.length) > 1 ? 's' : ''})`
							: ''}
					</ActionButton>
				</CardContent>
			</Card>
		</form>
	)
}
