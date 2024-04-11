import { ListingList } from '@/components/listing-list'
import { RulesList } from '@/components/rules-list'

export const dynamic = 'force-dynamic'

export default async function RootPage() {
	return (
		<div className='grid gap-8'>
			<RulesList />
			<ListingList />
		</div>
	)
}
