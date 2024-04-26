import { TableCell, TableRow } from '@/components/ui/table'
import { Tables } from '@/db_types'
import RuleActions from './rule-actions'

export default function Rule({ rule }: { rule: Tables<'rules'> }) {
	return (
		<TableRow>
			<TableCell className='font-medium w-[99%]'>
				<div className='line-clamp-1'>{rule.rule}</div>
			</TableCell>
			<TableCell className='hidden md:table-cell whitespace-nowrap'>{new Date(rule.created_at).toDateString()}</TableCell>
			<TableCell className='whitespace-nowrap'>
				<RuleActions ruleId={rule.id} />
			</TableCell>
		</TableRow>
	)
}
