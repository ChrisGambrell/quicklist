import BackButton from '@/components/back-button'
import prisma from '@/lib/db'
import { ServerProps } from '@cgambrell/utils'
import { notFound } from 'next/navigation'
import UserListings from './cards/user-listings'
import UserRules from './cards/user-rules'

// TODO: Finish this page with user info like name, email, avatar, oauth privider, etc

export default async function UserPage({ params: { userId } }: ServerProps) {
	// TODO: Check RLS
	const user = await prisma.user.findUnique({ where: { id: userId }, include: { listings: { include: { images: true } }, rules: true } })
	if (!user) return notFound()

	return (
		<div className='mx-auto grid max-w-[59rem] flex-1 auto-rows-max gap-4 w-full'>
			<div className='flex items-center gap-4 overflow-hidden'>
				<div className='flex-shrink-0'>
					<BackButton href='/users' />
				</div>
				<h1 className='flex-1 whitespace-nowrap text-xl font-semibold tracking-tight truncate'>{user.name}</h1>
			</div>
			{/* <div className='grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3'> */}
			<div className='grid auto-rows-max items-start gap-4 lg:col-span-2'>
				<UserListings listings={user.listings} />
				<UserRules rules={user.rules} />
			</div>
			{/* TODO: What's this commented out crap? */}
			{/* <div className='grid auto-rows-max items-start gap-4'> */}
			{/* <ListingImages listing={listing} /> */}
			{/* <GenerateDetails listing={listing} /> */}
			{/* <DeleteListing listing={listing} /> */}
			{/* </div> */}
			{/* </div> */}
		</div>
	)
}
