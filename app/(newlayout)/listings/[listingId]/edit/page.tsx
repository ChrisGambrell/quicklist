import { getListingImages } from '@/utils/helpers/server'
import { createClient } from '@/utils/supabase/server'
import { notFound } from 'next/navigation'
import EditListingClient from './edit-listing-client'

export default async function EditListingPage({ params: { listingId } }: { params: { listingId: string } }) {
	const supabase = createClient()

	const { data: listing } = await supabase.from('listings').select().eq('id', listingId).maybeSingle()
	const images = await getListingImages(listingId)

	if (!listing) return notFound()
	return <EditListingClient listing={listing} images={images} />
}
