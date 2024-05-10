import BackButton from '@/components/back-button'
import { createClient } from '@/utils/supabase/server'
import { ListingWithImages } from '@/utils/types'
import { notFound } from 'next/navigation'
import UserListings from './cards/user-listings'

// TODO: Finish this page with user info like name, email, avatar, oauth privider, etc

export default async function UserPage({ params: { userId } }: { params: { userId: string } }) {
	const supabase = createClient()

	const { data: user, error } = await supabase
		.from('users')
		.select('*, listings(*, images:listing_images(*))')
		.eq('id', userId)
		.maybeSingle()
	console.log({ error })

	if (!user) return notFound()
	return (
		<div className='mx-auto grid max-w-[59rem] flex-1 auto-rows-max gap-4 w-full'>
			<div className='flex items-center gap-4 overflow-hidden'>
				<div className='flex-shrink-0'>
					<BackButton href='/users' />
				</div>
				<h1 className='flex-1 whitespace-nowrap text-xl font-semibold tracking-tight truncate'>{user.full_name}</h1>
			</div>
			{/* <div className='grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3'> */}
			<div className='grid auto-rows-max items-start gap-4 lg:col-span-2'>
				{/* <ListingForm listing={listing} /> */}
				<UserListings listings={user.listings as ListingWithImages[]} />
			</div>
			{/* <div className='grid auto-rows-max items-start gap-4'> */}
			{/* <ListingImages listing={listing} /> */}
			{/* <GenerateDetails listing={listing} /> */}
			{/* <DeleteListing listing={listing} /> */}
			{/* </div> */}
			{/* </div> */}
		</div>
	)
}
