import { EmptyState } from '@/components/empty-state'
import PageView from '@/components/layout/page-view'
import { createClient } from '@/utils/supabase/server'
import { ListTodoIcon } from 'lucide-react'
import { Listing } from './components/listing'
import NewListing from './components/new-listing'

export default async function RootPage() {
	const supabase = createClient()
	const { data: listings } = await supabase.from('listings').select().order('created_at', { ascending: true })

	return (
		<PageView title='My Listings' action={<NewListing />}>
			{!listings || listings.length === 0 ? (
				<EmptyState icon={ListTodoIcon} type='listing' />
			) : (
				[...listings.filter((listing) => !listing.title), ...listings.filter((listing) => !!listing.title)].map((listing) => (
					<Listing key={listing.id} listing={listing} />
				))
			)}
		</PageView>
	)
}
