import { BackButton } from '@/components/back-button'
import { auth } from '@/lib/auth'
import prisma from '@/lib/db'
import { Listing } from '@prisma/client'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { DeleteListing } from './cards/delete-listing'
import { GenerateDetails } from './cards/generate-details'
import { ListingForm } from './cards/listing-form'
import { ListingGenerations } from './cards/listing-generations'
import { ListingImages } from './cards/listing-images'

export const metadata: Metadata = {
	title: 'QuickList - Edit Listing',
	description: 'Edit a listing and its images and generations',
}

// TODO: Needs to be in config
export const maxDuration = 300

export default async function EditListingPage({ params: { listingId } }: { params: { listingId: Listing['id'] } }) {
	const user = await auth()
	const listing = await prisma.listing.findUnique({
		where: { id: listingId, userId: user.isAdmin ? undefined : user.id },
		include: { generations: { orderBy: { createdAt: 'desc' } }, images: { orderBy: { isPrimary: 'desc' } } },
	})
	// TODO: Not found page
	if (!listing) return notFound()

	return (
		<div className='mx-auto grid max-w-[59rem] flex-1 auto-rows-max gap-4 w-full'>
			<div className='flex items-center gap-4 overflow-hidden'>
				<div className='flex-shrink-0'>
					<BackButton href='/listings' />
				</div>
				<h1 className='flex-1 whitespace-nowrap text-xl font-semibold tracking-tight truncate'>{listing.title}</h1>
			</div>
			<div className='grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3'>
				<div className='grid auto-rows-max items-start gap-4 lg:col-span-2'>
					<ListingForm canEdit={user.id === listing.userId} listing={listing} />
					{listing.generations.length > 0 && <ListingGenerations listing={listing} />}
				</div>
				<div className='grid auto-rows-max items-start gap-4'>
					<ListingImages canEdit={user.id === listing.userId} listing={listing} />
					{user.id === listing.userId && (
						<>
							<GenerateDetails listing={listing} />
							<DeleteListing listing={listing} />
						</>
					)}
				</div>
			</div>
		</div>
	)
}
