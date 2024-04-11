import DeleteRuleButton from '@/components/delete-rule-button'
import { Listing } from '@/components/listing'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { createClient } from '@/utils/supabase/server'
import { addRule, createListing } from './actions'

export const dynamic = 'force-dynamic'

export default async function RootPage() {
	const supabase = createClient()
	const { data: listings } = await supabase.from('listings').select()
	const { data: rules } = await supabase.from('rules').select()

	return (
		<div className='grid gap-8'>
			<div className='grid gap-2'>
				<h3 className='tracking-tight font-bold'>Rules</h3>

				<form action={addRule} className='grid gap-2'>
					{rules?.map((rule) => (
						<div key={rule.id} className='flex space-x-1 items-center'>
							<div className='flex-1'>- {rule.rule}</div>
							<div className='flex-shrink-0'>
								<DeleteRuleButton ruleId={rule.id} />
							</div>
						</div>
					))}
					<Input id='rule' name='rule' placeholder='Add a new rule' />
					<Button className='sm:w-fit'>Update</Button>
				</form>
			</div>
			<Separator />
			<div className='grid gap-2'>
				<div className='flex items-end space-x-4'>
					<div className='flex-1'>
						<h3 className='tracking-tight font-bold text-3xl'>My listings</h3>
					</div>
					<form action={createListing} className='flex-shrink-0'>
						<Button size='sm'>New Listing</Button>
					</form>
				</div>
				<div className='grid gap-2'>
					{listings?.map((listing) => (
						<Listing key={listing.id} listing={listing} />
					))}
				</div>
			</div>
		</div>
	)
}
