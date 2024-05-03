import { Tables } from '@/db_types'
import { getListingImages } from '@/utils/_helpers'
import { createClient } from '@/utils/supabase/server'
import { Listing } from '@/utils/types'
import { notFound } from 'next/navigation'
import EditListingClient from './edit-listing-client'

export default async function EditListingPage({ params: { listingId } }: { params: { listingId: Listing['id'] } }) {
	const supabase = createClient()

	const { data: listing } = await supabase
		.from('listings')
		.select('*, images:listing_images(*)')
		.eq('id', listingId)
		.order('is_primary', { ascending: false, referencedTable: 'listing_images' })
		.maybeSingle()

	if (!listing) return notFound()
	return <EditListingClient listing={listing} />
}
