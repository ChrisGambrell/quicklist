import { Tables } from '@/db_types'
import { getListingImages } from '@/utils/helpers'
import Link from 'next/link'

export async function Listing({ listing }: { listing: Tables<'listings'> }) {
	const images = await getListingImages(listing.id)

	return (
		<Link
			className='flex space-x-2 items-center text-xs border rounded-lg shadow p-2 cursor-pointer hover:shadow-md transition-shadow sm:p-4 sm:text-base sm:items-start sm:space-x-4'
			href={`/listing/${listing.id}`}>
			{images && images.length > 0 && (
				<div className='flex-shrink-0'>
					<img className='h-12 sm:h-24 rounded-lg' src={images[0].signedUrl} />
				</div>
			)}
			<div className='flex-1'>
				<div className='font-semibold'>{listing.title}</div>
				<div>${listing.price}</div>
				<div className='line-clamp-1 sm:line-clamp-2'>{listing.description}</div>
			</div>
		</Link>
	)
}
