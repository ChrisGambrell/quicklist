import { createListing } from '@/app/actions'
import { createClient } from '@/utils/supabase/server'
import { ListTodoIcon } from 'lucide-react'
import { EmptyState } from './empty-state'
import { Listing } from './listing'
import { Button } from './ui/button'

export async function ListingList() {
	const supabase = createClient()
	const { data: listings } = await supabase.from('listings').select().order('created_at', { ascending: true })

	return (
		<div className='grid gap-2'>
			<div className='flex items-end space-x-4'>
				<div className='flex-1'>
					<h2 className='tracking-tight font-bold text-3xl'>My Listings</h2>
				</div>
				<form action={createListing} className='flex-shrink-0'>
					<Button size='sm'>New Listing</Button>
				</form>
			</div>
			<div className='grid gap-2'>
				{!listings || listings.length === 0 ? (
					<form action={createListing}>
						<EmptyState buttonType='submit' icon={ListTodoIcon} type='listing' />
					</form>
				) : (
					[...listings.filter((listing) => !listing.title), ...listings.filter((listing) => !!listing.title)].map((listing) => (
						<Listing key={listing.id} listing={listing} />
					))
				)}
			</div>
		</div>
	)
}
