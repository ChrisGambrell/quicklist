import { Tables } from '@/db_types'
import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import DeleteListingButton from './delete-listing-button'
import { Badge } from './ui/badge'

export async function Listing({ listing }: { listing: Tables<'listings'> }) {
	const supabase = createClient()
	const { data } = await supabase.storage.from('listings').createSignedUrl(listing.file_path ?? '', 60 * 60)

	return (
		<div className='flex flex-col sm:flex-row border rounded-lg shadow p-6 space-y-6 sm:space-y-0 sm:space-x-6'>
			{data?.signedUrl && (
				<div className='mx-auto'>
					<img className='h-40 rounded-lg' src={data.signedUrl} />
				</div>
			)}
			<div className='flex-1 space-y-2'>
				<div>
					<Link className='font-bold hover:underline' href={`/listing/${listing.id}`}>
						{listing.title}
					</Link>
				</div>
				<Badge variant='secondary'>${listing.price}</Badge>
				<div className='text-sm'>{listing.description}</div>
				<DeleteListingButton listingId={listing.id} />
			</div>
		</div>
	)
}
