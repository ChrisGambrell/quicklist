import { Tables } from '@/db_types'
import { getListingImages } from '@/utils/_helpers'
import { createClient } from '@/utils/supabase/server'
import { notFound } from 'next/navigation'
import EditListingClient from './edit-listing-client'

export default async function EditListingPage({ params: { listingId } }: { params: { listingId: Tables<'listings'>['id'] } }) {
	const supabase = createClient()

	const { data: listing } = await supabase.from('listings').select().eq('id', listingId).maybeSingle()
	const images = await getListingImages({ listingId })

	if (!listing) return notFound()
	return <EditListingClient listing={listing} images={images} />
}
