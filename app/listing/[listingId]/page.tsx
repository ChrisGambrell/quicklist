import RegenerateButton from '@/components/regenerate-button'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import UploadImagesForm from '@/components/upload-images-form'
import { createClient } from '@/utils/supabase/server'
import { notFound } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function ListingPage({ params: { listingId } }: { params: { listingId: string } }) {
	const supabase = createClient()

	const { data: listing } = await supabase.from('listings').select().eq('id', listingId).maybeSingle()
	if (!listing) return notFound()

	const { data: filePaths } = await supabase.storage.from('listings').list(listingId)
	const { data: signedUrls } = await supabase.storage
		.from('listings')
		.createSignedUrls(filePaths?.map((path) => `${listingId}/${path.name}`) ?? [], 60 * 60 * 24)

	return (
		<form className='grid gap-8'>
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
					signedUrls={signedUrls?.map((url) => ({ path: url.path, signedUrl: url.signedUrl })) ?? []}
				/>
			</div>
			<div className='space-x-2'>
				{/* TODO: update listing */}
				<Button>Update listing</Button>
				<RegenerateButton listingId={listingId} urls={signedUrls?.map((url) => url.signedUrl) ?? []} />
			</div>
		</form>
	)
}
