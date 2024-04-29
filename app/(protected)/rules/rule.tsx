import { TableCell, TableRow } from '@/components/ui/table'
import { Tables } from '@/db_types'
import Link from 'next/link'
import RuleActions from './rule-actions'

export default function Rule({ rule }: { rule: Tables<'rules'> }) {
	return (
		<TableRow>
			<TableCell className='font-medium w-[99%]'>
				<Link className='line-clamp-1 hover:underline' href={`/rules/${rule.id}/edit`}>
					{rule.rule}
				</Link>
			</TableCell>
			<TableCell className='hidden md:table-cell whitespace-nowrap'>{new Date(rule.created_at).toDateString()}</TableCell>
			<TableCell className='whitespace-nowrap'>
				<RuleActions ruleId={rule.id} />
			</TableCell>
		</TableRow>
	)
}
