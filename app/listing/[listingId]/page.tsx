import RegenerateButton from '@/components/regenerate-button'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import UploadImagesForm from '@/components/upload-images-form'
import { getListingImages } from '@/utils/helpers'
import { createClient } from '@/utils/supabase/server'
import { ArrowLeftIcon } from 'lucide-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function ListingPage({ params: { listingId } }: { params: { listingId: string } }) {
	const supabase = createClient()

	const { data: listing } = await supabase.from('listings').select().eq('id', listingId).maybeSingle()
	if (!listing) return notFound()
	const images = await getListingImages(listingId)

	return (
		<form className='grid gap-8'>
			<Button asChild className='w-fit' variant='secondary'>
				<Link href='/'>
					<ArrowLeftIcon className='w-5 h-5 mr-2' />
					Go back
				</Link>
			</Button>
			<div>
				<h1 className='text-3xl tracking-tight font-bold'>Add a New Listing</h1>
			</div>
			<div className='grid gap-2'>
				<Label htmlFor='title'>Title</Label>
				<Input
					className='placeholder:italic'
					defaultValue={listing.title ?? ''}
					id='title'
					name='title'
					placeholder={"Classic Navy and White Checkered Men's Long Sleeve Shirt"}
				/>
			</div>
			<div className='grid gap-2'>
				<Label htmlFor='description'>Description</Label>
				<Textarea
					className='placeholder:italic'
					defaultValue={listing.description ?? ''}
					id='description'
					name='description'
					placeholder={'Enhance your wardrobe with this timeless navy and white checkered long sleeve shirt...'}
				/>
			</div>
			<div className='grid gap-2'>
				<Label htmlFor='price'>Price</Label>
				<Input
					className='placeholder:italic'
					defaultValue={listing.price?.toString()}
					id='price'
					name='price'
					placeholder='12.49'
				/>
			</div>
			<div className='grid gap-2'>
				<Label htmlFor='image'>Images</Label>
				<UploadImagesForm
					listingId={listingId}
					signedUrls={images?.map((image) => ({ path: image.path, signedUrl: image.signedUrl })) ?? []}
				/>
			</div>
			<div className='space-x-2'>
				{/* TODO: update listing */}
				<Button>Update listing</Button>
				<RegenerateButton listingId={listingId} />
			</div>
		</form>
	)
}
