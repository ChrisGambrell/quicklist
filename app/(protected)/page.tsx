import { EmptyState } from '@/components/empty-state'
import { createClient } from '@/utils/supabase/server'
import { ListTodoIcon } from 'lucide-react'
import { Listing } from './components/listing'
import NewListing from './components/new-listing'

export default async function RootPage() {
	const supabase = createClient()
	const { data: listings } = await supabase.from('listings').select().order('created_at', { ascending: true })

	return (
		<div className='grid gap-4'>
			<div className='flex items-end space-x-4'>
				<div className='flex-1'>
					<h2 className='tracking-tight font-bold text-3xl'>My Listings</h2>
				</div>
				<NewListing />
			</div>
			<div className='grid gap-2'>
				{!listings || listings.length === 0 ? (
					<EmptyState icon={ListTodoIcon} type='listing' />
				) : (
					[...listings.filter((listing) => !listing.title), ...listings.filter((listing) => !!listing.title)].map((listing) => (
						<Listing key={listing.id} listing={listing} />
					))
				)}
			</div>
		</div>
	)
}
