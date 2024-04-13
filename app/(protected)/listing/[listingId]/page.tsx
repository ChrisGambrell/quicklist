import { getListingImages } from '@/utils/helpers/server'
import { createClient } from '@/utils/supabase/server'
import { notFound } from 'next/navigation'
import DeleteListingButton from './components/delete-listing-button'
import ListingForm from './components/listing-form'
import ListingImages from './components/listing-images'

export default async function ListingPage({ params: { listingId } }: { params: { listingId: string } }) {
	const supabase = createClient()

	const { data: listing } = await supabase.from('listings').select().eq('id', listingId).maybeSingle()
	if (!listing) return notFound()
	const images = await getListingImages(listing.id)

	return (
		<div className='grid gap-4 sm:gap-8'>
			<div className='flex items-end space-x-4'>
				<div className='flex-1'>
					<h1 className='text-3xl tracking-tight font-bold'>Add a New Listing</h1>
				</div>
				<div className='flex-shrink-0'>
					<DeleteListingButton listingId={listing.id} />
				</div>
			</div>

			<ListingForm listing={listing} />
			<ListingImages listingId={listing.id} images={images} />
		</div>
	)
}
