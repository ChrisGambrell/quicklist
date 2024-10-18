import { createRule } from '@/actions/rule'
import { ActionButton } from '@/components/action-button'
import { DataTable } from '@/components/data-table'
import { auth } from '@/lib/auth'
import prisma from '@/lib/db'
import { PlusCircleIcon } from 'lucide-react'
import { Metadata } from 'next'
import { columns } from './columns'

export const metadata: Metadata = {
	title: 'QuickList - Rules',
	description: 'List of rules',
}

export default async function RulesPage() {
	const user = await auth()
	const rules = await prisma.rule.findMany({ where: { userId: user.isAdmin ? undefined : user.id }, orderBy: { createdAt: 'asc' } })

	return (
		<div className='container grid gap-4'>
			<AddRuleButton />

			{rules?.length ? (
				<DataTable columns={columns} data={rules} defaultState={{ pageSize: 10, sorting: [{ id: 'created_at', desc: true }] }} />
			) : (
				<div className='flex items-center justify-center rounded-lg border border-dashed shadow-sm p-12'>
					<div className='flex flex-col items-center gap-1 text-center'>
						<h3 className='text-2xl font-bold tracking-tight'>You have no rules</h3>
						<p className='text-sm text-muted-foreground mb-4'>Start by adding a rule.</p>
						<AddRuleButton />
					</div>
				</div>
			)}
		</div>
	)
}

function AddRuleButton() {
	return (
		<form action={createRule} className='flex justify-end'>
			<ActionButton className='gap-1' size='sm'>
				<PlusCircleIcon className='w-3.5 h-3.5' />
				Add Rule
			</ActionButton>
		</form>
	)
}
