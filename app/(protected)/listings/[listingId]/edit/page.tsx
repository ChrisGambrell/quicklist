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
	const { data: generations } = await supabase
		.from('generations')
		.select()
		.eq('listing_id', listingId)
		.order('created_at', { ascending: false })

	if (!listing) return notFound()
	return <EditListingClient listing={listing} generations={generations ?? []} />
}
