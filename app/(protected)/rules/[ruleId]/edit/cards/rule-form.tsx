'use client'

import { updateRule } from '@/actions/rule'
import ActionButton from '@/components/action-button'
import { FormError } from '@/components/form-error'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Rule } from '@prisma/client'
import { useFormState } from 'react-dom'

export default function RuleForm({ canEdit, rule }: { canEdit: boolean; rule: Rule }) {
	const [state, action] = useFormState(updateRule.bind(null, { ruleId: rule.id }), null)

	return (
		<form action={action}>
			<Card>
				<CardHeader>
					<CardTitle>Rule Details</CardTitle>
					<CardDescription>A rule is followed when generating listing details automatically.</CardDescription>
				</CardHeader>
				<CardContent>
					<div className='grid gap-6'>
						<div className='grid gap-3'>
							<Label htmlFor='rule'>Rule</Label>
							<Input id='rule' name='rule' defaultValue={rule.rule ?? ''} />
							<FormError value={state?.errors.rule} />
						</div>
					</div>
				</CardContent>
				{canEdit && (
					<CardFooter>
						<div className='ml-auto flex gap-2'>
							<Button variant='outline' size='sm' type='reset'>
								Discard
							</Button>
							<ActionButton size='sm'>Save Rule</ActionButton>
						</div>
					</CardFooter>
				)}
			</Card>
		</form>
	)
}
