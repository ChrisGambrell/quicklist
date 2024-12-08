import ActionButton from '@/components/action-button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { requiredCredits } from '@/utils/helpers'
import { ListingWithGenerationsAndImages } from '@/utils/types'

export default function GenerateDetails({ listing }: { listing: ListingWithGenerationsAndImages }) {
	// TODO: Reactivate generate listing data
	// const useGenerateData = generateListingData.bind(null, { listingId: listing.id })

	return (
		// <form action={useGenerateData}>
		<form>
			<Card>
				<CardHeader>
					<CardTitle>Generate Listing Data</CardTitle>
					<CardDescription>Generate the listing&apos;s data based on its details and images.</CardDescription>
				</CardHeader>
				<CardContent>
					{/* <ActionButton className='w-full' disabled={!listing.images.length} size='sm' variant='secondary'> */}
					<ActionButton className='w-full' disabled size='sm' variant='secondary'>
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
