import DeleteRuleButton from '@/components/delete-rule-button'
import { Listing } from '@/components/listing'
import NewRule from '@/components/new-rule'
import { Button } from '@/components/ui/button'
import { createClient } from '@/utils/supabase/server'
import { ListTodoIcon, LucideIcon, ScaleIcon } from 'lucide-react'
import { createListing } from './actions'

export const dynamic = 'force-dynamic'

export default async function RootPage() {
	return (
		<div className='grid gap-8'>
			<RulesList />
			<ListingList />
		</div>
	)
}

function EmptyState({ icon: Icon, type }: { icon: LucideIcon; type: string }) {
	return (
		<button
			type='button'
			className='relative block w-full rounded-lg border-2 border-dashed border-gray-300 p-12 text-center hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2'>
			<Icon className='w-10 h-10 sm:w-12 sm:h-12 mx-auto text-gray-400 stroke-1' />
			<span className='mt-2 block text-sm font-semibold text-gray-500'>Create a new {type}</span>
		</button>
	)
}

async function RulesList() {
	const supabase = createClient()
	const { data: rules } = await supabase.from('rules').select()

	return (
		<div className='grid gap-2'>
			<div className='flex items-end space-x-4'>
				<div className='flex-1'>
					<h2 className='tracking-tight font-bold text-3xl'>My Rules</h2>
				</div>
				{/* TODO: Create new rule */}
				<div className='flex-shrink-0'>
					<NewRule trigger={<Button size='sm'>New Rule</Button>} />
				</div>
			</div>
			<div className='grid gap-2'>
				{!rules || rules.length === 0 ? (
					<NewRule trigger={<EmptyState icon={ScaleIcon} type='rule' />} />
				) : (
					rules.map((rule) => (
						<div key={rule.id} className='flex space-x-2 items-center text-sm border rounded-lg shadow p-1 pl-3 sm:space-x-4'>
							<div className='flex-1'>{rule.rule}</div>
							<div className='flex-shrink-0'>
								<DeleteRuleButton ruleId={rule.id} />
							</div>
						</div>
					))
				)}
			</div>
		</div>
	)
}

async function ListingList() {
	const supabase = createClient()
	const { data: listings } = await supabase.from('listings').select()

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
					<EmptyState icon={ListTodoIcon} type='listing' />
				) : (
					listings.map((listing) => <Listing key={listing.id} listing={listing} />)
				)}
			</div>
		</div>
	)
}
