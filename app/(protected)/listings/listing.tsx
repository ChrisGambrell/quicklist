import { TableCell, TableRow } from '@/components/ui/table'
import { Tables } from '@/db_types'
import { getListingImages } from '@/utils/_helpers'
import { PLACEHOLDER_IMAGE } from '@/utils/constants'
import Image from 'next/image'
import ListingActions from './listing-actions'

export async function Listing({ listing }: { listing: Tables<'listings'> }) {
	const images = await getListingImages({ listingId: listing.id })

	return (
		<TableRow>
			<TableCell className='hidden sm:table-cell min-w-[100px]'>
				<Image
					src={images && images.length > 0 ? images[0].signedUrl : PLACEHOLDER_IMAGE}
					alt='Listing image'
					className='aspect-square rounded-md object-cover'
					height={64}
					width={64}
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
