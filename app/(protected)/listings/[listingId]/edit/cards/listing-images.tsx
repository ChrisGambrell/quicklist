import { deleteImage } from '@/actions/listing'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { PLACEHOLDER_IMAGE } from '@/utils/constants'
import { getImageUrl } from '@/utils/helpers'
import { ListingWithGenerationsAndImages, ListingImage as TListingImage } from '@/utils/types'
import Image from 'next/image'
import UploadImages from '../components/upload-images'

export default function ListingImages({ canEdit, listing }: { canEdit: boolean; listing: ListingWithGenerationsAndImages }) {
	return (
		<Card className='overflow-hidden' x-chunk='dashboard-07-chunk-4'>
			<CardHeader>
				<CardTitle>Product Images</CardTitle>
				<CardDescription>Click on an image to remove it.</CardDescription>
			</CardHeader>
			<CardContent>
				<form className='grid gap-2'>
					{listing.images.length ? (
						<ListingImage image={listing.images[0]} variant='primary' />
					) : (
						<Image
							src={PLACEHOLDER_IMAGE}
							alt='Listing image'
							className='aspect-square w-full rounded-md object-cover'
							height={300}
							width={300}
						/>
					)}
					<div className='grid grid-cols-3 gap-2'>
						{listing.images.slice(1).map((image) => (
							<ListingImage key={image.id} image={image} variant='secondary' />
						))}
						{canEdit && <UploadImages listingId={listing.id} />}
					</div>
					{canEdit && <div className='text-center text-sm text-foreground/50 italic'>Click on an image to remove it</div>}
				</form>
			</CardContent>
		</Card>
	)
}

function ListingImage({ image, variant }: { image: TListingImage; variant: 'primary' | 'secondary' }) {
	const useDeleteImage = deleteImage.bind(null, { listingId: image.listing_id, path: image.image_path })

	const sizeMap: Record<'primary' | 'secondary', number> = {
		primary: 84,
		secondary: 300,
	}

	return (
		<button formAction={useDeleteImage}>
			<Image
				src={getImageUrl(image.image_path)}
				alt='Listing image'
				className='aspect-square w-full rounded-md object-cover'
				height={sizeMap[variant]}
				width={sizeMap[variant]}
			/>
		</button>
	)
}
