import { TableCell, TableRow } from '@/components/ui/table'
import { Tables } from '@/db_types'
import { getListingImages } from '@/utils/helpers/server'
import ListingActions from './listing-actions'

export async function Listing({ listing }: { listing: Tables<'listings'> }) {
	// TODO: Need to pass props as object
	const images = await getListingImages(listing.id)

	return (
		<TableRow>
			<TableCell className='hidden sm:table-cell min-w-[100px]'>
				{/* TODO: Placeholder image */}
				{/* TODO: Use Image and make sure urls are configured */}
				<img
					className='aspect-square rounded-md object-cover'
					src={images && images.length > 0 ? images[0].signedUrl : 'https://ui.shadcn.com/placeholder.svg'}
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
