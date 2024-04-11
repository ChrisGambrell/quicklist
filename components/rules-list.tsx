import { createClient } from '@/utils/supabase/server'
import { ScaleIcon } from 'lucide-react'
import DeleteRuleButton from './delete-rule-button'
import { EmptyState } from './empty-state'
import NewRule from './new-rule'
import { Button } from './ui/button'

export async function RulesList() {
	const supabase = createClient()
	const { data: rules } = await supabase.from('rules').select().order('created_at', { ascending: true })

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
