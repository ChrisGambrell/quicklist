import { TableCell, TableRow } from '@/components/ui/table'
import { Tables } from '@/db_types'
import { getListingImages } from '@/utils/_helpers'
import { PLACEHOLDER_IMAGE } from '@/utils/constants'
import ListingActions from './listing-actions'

export async function Listing({ listing }: { listing: Tables<'listings'> }) {
	const images = await getListingImages({ listingId: listing.id })

	return (
		<TableRow>
			<TableCell className='hidden sm:table-cell min-w-[100px]'>
				{/* TODO: Use Image and make sure urls are configured */}
				<img
					className='aspect-square rounded-md object-cover'
					src={images && images.length > 0 ? images[0].signedUrl : PLACEHOLDER_IMAGE}
					alt='Product image'
					height='64'
					width='64'
				/>
			</TableCell>
			<TableCell className='font-medium w-[99%]'>
				<div className='line-clamp-1'>{listing.title ?? '-'}</div>
			</TableCell>
			<TableCell className='hidden md:table-cell whitespace-nowrap'>{listing.price !== null ? `$${listing.price}` : '-'}</TableCell>
			<TableCell className='hidden md:table-cell whitespace-nowrap'>{new Date(listing.created_at).toDateString()}</TableCell>
			<TableCell className='whitespace-nowrap'>
				<ListingActions listingId={listing.id} />
			</TableCell>
		</TableRow>
	)
}
