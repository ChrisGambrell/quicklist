import { deleteRule } from '@/actions/rule'
import { ActionButton } from '@/components/action-button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Rule } from '@/utils/types'

export default function DeleteRule({ rule }: { rule: Rule }) {
	const useDeleteRule = deleteRule.bind(null, { ruleId: rule.id })

	return (
		<form action={useDeleteRule}>
			<Card>
				<CardHeader>
					<CardTitle>Delete Rule</CardTitle>
					<CardDescription>This cannot be reversed.</CardDescription>
				</CardHeader>
				<CardContent>
					<ActionButton className='w-full' size='sm' variant='destructive'>
						Delete Rule
					</ActionButton>
				</CardContent>
			</Card>
		</form>
	)
}
