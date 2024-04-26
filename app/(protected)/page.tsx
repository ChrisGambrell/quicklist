import { EmptyState } from '@/components/empty-state'
import PageView from '@/components/layout/page-view'
import { createClient } from '@/utils/supabase/server'
import { ListTodoIcon } from 'lucide-react'
import { Listing } from '../(newlayout)/listings/listing'
import NewListingButton from '../(newlayout)/listings/new-listing-button'

export default async function RootPage() {
	const supabase = createClient()
	const { data: listings } = await supabase.from('listings').select().order('created_at', { ascending: true })

	return (
		<PageView title='My Listings' action={<NewListingButton />}>
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
