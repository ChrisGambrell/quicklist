import { DataTable } from '@/components/data-table'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Rule } from '@/utils/types'
import { ruleColumns } from '../components/rule-columns'

export default function UserRules({ rules }: { rules: Rule[] }) {
	return (
		<Card>
			<CardHeader>
				<div className='flex items-start justify-between'>
					<CardTitle>Rules</CardTitle>
				</div>
			</CardHeader>
			<CardContent>
				<DataTable columns={ruleColumns} data={rules} defaultState={{ pageSize: 5, sorting: [{ id: 'created_at', desc: true }] }} />
			</CardContent>
		</Card>
	)
}
