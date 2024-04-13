import { Tables } from '@/db_types'
import DeleteRuleButton from './delete-rule-button'

export default function Rule({ rule }: { rule: Tables<'rules'> }) {
	return (
		<div className='flex space-x-2 items-center text-sm border rounded-lg shadow p-1 pl-3 sm:space-x-4'>
			<div className='flex-1'>{rule.rule}</div>
			<div className='flex-shrink-0'>
				<DeleteRuleButton ruleId={rule.id} />
			</div>
		</div>
	)
}
