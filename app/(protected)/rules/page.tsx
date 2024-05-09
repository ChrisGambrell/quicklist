import AddRuleButton from '@/app/(protected)/rules/add-rule-button'
import ActionButton from '@/components/action-button'
import { DataTable } from '@/components/data-table'
import { getAuth } from '@/utils/_helpers'
import { PlusCircleIcon } from 'lucide-react'
import { Metadata } from 'next'
import { columns } from './columns'

export const metadata: Metadata = {
	title: 'QuickList - Rules',
	description: 'List of rules',
}

export default async function RulesPage() {
	const { user, supabase } = await getAuth()
	const { data: rules } = await supabase.from('rules').select().eq('user_id', user.id).order('created_at', { ascending: true })

	return (
		<div className='container grid gap-4'>
			{/* BUG: Should create a new rule then link to empty rule */}
			<form action='' className='flex justify-end'>
				<ActionButton className='gap-1' size='sm'>
					<PlusCircleIcon className='w-3.5 h-3.5' />
					Add Rule
				</ActionButton>
			</form>

			{rules?.length ? (
				<DataTable columns={columns} data={rules} defaultState={{ sorting: [{ id: 'created_at', desc: true }] }} />
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
