import { createClient } from '@/utils/supabase/server'
import { Listing } from '@/utils/types'
import { notFound } from 'next/navigation'
import EditListingClient from './edit-listing-client'

export default async function EditListingPage({ params: { listingId } }: { params: { listingId: Listing['id'] } }) {
	const supabase = createClient()
	const { data: listing } = await supabase
		.from('listings')
		.select('*, generations(*), images:listing_images(*)')
		.eq('id', listingId)
		.order('created_at', { ascending: false, referencedTable: 'generations' })
		.order('is_primary', { ascending: false, referencedTable: 'listing_images' })
		.maybeSingle()

	if (!listing) return notFound()
	return <EditListingClient listing={listing} />
}
