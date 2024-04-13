import { Tables } from '@/db_types'
import { getListingImages } from '@/utils/helpers/server'
import { createClient } from '@/utils/supabase/server'
import { ImageIcon } from 'lucide-react'
import Link from 'next/link'

export async function Listing({ listing }: { listing: Tables<'listings'> }) {
	const supabase = createClient()
	const images = await getListingImages(listing.id)

	return (
		<Link
			className='flex space-x-2 items-center text-xs border rounded-lg shadow p-2 cursor-pointer hover:shadow-md transition-shadow sm:p-4 sm:text-base sm:items-start sm:space-x-4'
			href={`/listing/${listing.id}`}>
			<div className='flex-shrink-0'>
				{images && images.length > 0 ? (
					<img className='h-12 w-12 sm:h-24 sm:w-24 object-cover rounded-lg' src={images[0].signedUrl} />
				) : (
					<div className='h-12 w-12 sm:h-24 sm:w-24 rounded-lg bg-gray-200 flex items-center justify-center'>
						<ImageIcon className='w-5 h-5 sm:w-7 sm:h-7 text-gray-400' />
					</div>
				)}
			</div>
			<div className='flex-1'>
				<div className='font-semibold'>{listing.title ?? 'Untitled'}</div>
				<div>${listing.price ?? '-'}</div>
				<div className='line-clamp-1 sm:line-clamp-2'>{listing.description}</div>
			</div>
		</Link>
	)
}
