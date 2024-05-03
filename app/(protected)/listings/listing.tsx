import { TableCell, TableRow } from '@/components/ui/table'
import { PLACEHOLDER_IMAGE } from '@/utils/constants'
import { getImageUrl } from '@/utils/helpers'
import { ListingWithGenerationsAndImages } from '@/utils/types'
import Image from 'next/image'
import Link from 'next/link'
import ListingActions from './listing-actions'

export async function Listing({ listing }: { listing: ListingWithGenerationsAndImages }) {
	return (
		<TableRow>
			<TableCell className='hidden sm:table-cell min-w-[100px]'>
				<Image
					src={listing.images.length ? getImageUrl(listing.images[0].image_path) : PLACEHOLDER_IMAGE}
					alt='Listing image'
					className='aspect-square rounded-md object-cover'
					height={64}
					width={64}
				/>
			</TableCell>
			<TableCell className='font-medium w-[99%]'>
				<Link className='line-clamp-1 hover:underline' href={`/listings/${listing.id}/edit`}>
					{listing.title ?? '-'}
				</Link>
			</TableCell>
			<TableCell className='hidden md:table-cell whitespace-nowrap'>{listing.price !== null ? `$${listing.price}` : '-'}</TableCell>
			<TableCell className='hidden md:table-cell whitespace-nowrap'>{new Date(listing.created_at).toDateString()}</TableCell>
			<TableCell className='whitespace-nowrap'>
				<ListingActions listingId={listing.id} />
			</TableCell>
		</TableRow>
	)
}
