import { Tables } from '@/db_types'
import { createClient } from '@/utils/supabase/server'
import DeleteListingButton from './delete-listing-button'
import { Badge } from './ui/badge'

export async function Listing({ listing }: { listing: Tables<'listings'> }) {
	const supabase = createClient()
	const { data } = await supabase.storage.from('listings').createSignedUrl(listing.file_path ?? '', 60 * 60)

	return (
		<div className='flex border rounded-lg shadow p-6 space-x-6'>
			{data?.signedUrl && (
				<div className='flex-shrink-0'>
					<img className='h-40 rounded-lg' src={data.signedUrl} />
				</div>
			)}
			<div className='flex-1 space-y-2'>
				<div className='flex items-center space-x-2'>
					<div className='flex-1 font-bold line-clamp-1'>{listing.title}</div>
					<div className='flex-shrink-0'>
						<DeleteListingButton listingId={listing.id} />
					</div>
				</div>
				<Badge variant='secondary'>${listing.price}</Badge>
				<div className='text-sm'>{listing.description}</div>
			</div>
		</div>
	)
}
