'use client'

import { deleteRule, updateRule } from '@/actions/rule'
import ActionButton from '@/components/action-button'
import BackButton from '@/components/back-button'
import { FormError } from '@/components/form-error'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Tables } from '@/db_types'
import { useFormState } from 'react-dom'

export default function EditRuleClient({ rule }: { rule: Tables<'rules'> }) {
	const useUpdateRule = updateRule.bind(null, rule.id)
	const [state, action] = useFormState(useUpdateRule, null)
	// TODO: Pass these params as an object
	const useDeleteRule = deleteRule.bind(null, rule.id)

	return (
		<form className='mx-auto grid max-w-[59rem] flex-1 auto-rows-max gap-4 w-full'>
			<div className='flex items-center gap-4 overflow-hidden'>
				<div className='flex-shrink-0'>
					<BackButton />
				</div>

				<h1 className='flex-1 whitespace-nowrap text-xl font-semibold tracking-tight truncate'>{rule.rule}</h1>

				<div className='hidden items-center gap-2 md:ml-auto md:flex flex-shrink-0'>
					<Button variant='outline' size='sm' type='reset'>
						Discard
					</Button>
					<ActionButton formAction={action} size='sm'>
						Save Rule
					</ActionButton>
				</div>
			</div>
			<div className='grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3'>
				<div className='grid auto-rows-max items-start gap-4 lg:col-span-2'>
					<Card>
						<CardHeader>
							<CardTitle>Rule Details</CardTitle>
							<CardDescription>A rule is followed when generating listing details automatically.</CardDescription>
						</CardHeader>
						<CardContent>
							<div className='grid gap-6'>
								<div className='grid gap-3'>
									<Label htmlFor='rule'>Rule</Label>
									<Textarea id='rule' name='rule' defaultValue={rule.rule} className='min-h-32' />
									<FormError value={state?.errors.rule} />
								</div>
							</div>
						</CardContent>
					</Card>
				</div>
				<div className='grid auto-rows-max items-start gap-4'>
					<Card>
						<CardHeader>
							<CardTitle>Delete Rule</CardTitle>
							<CardDescription>This cannot be reversed.</CardDescription>
						</CardHeader>
						<CardContent>
							<ActionButton className='w-full' formAction={useDeleteRule} size='sm' variant='destructive'>
								Delete Rule
							</ActionButton>
						</CardContent>
					</Card>
				</div>
			</div>
			<div className='flex items-center justify-center gap-2 md:hidden'>
				<Button variant='outline' size='sm' type='reset'>
					Discard
				</Button>
				<ActionButton formAction={action} size='sm'>
					Save Rule
				</ActionButton>
			</div>
		</form>
	)
}
