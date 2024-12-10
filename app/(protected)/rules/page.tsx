import { DataTable } from '@/components/data-table'
import { Button } from '@/components/ui/button'
import { UpsertRule } from '@/components/upsert-rule'
import { auth } from '@/lib/auth'
import prisma from '@/lib/db'
import { PlusIcon } from 'lucide-react'
import { Metadata } from 'next'
import { columns } from './columns'

export const metadata: Metadata = {
	title: 'QuickList - Rules',
	description: 'List of rules',
}

export default async function RulesPage() {
	// TODO: Check RLS
	const user = await auth()
	const rules = await prisma.rule.findMany({ where: { userId: user.id }, orderBy: { createdAt: 'asc' } })

	return (
		<div className='container grid gap-4'>
			<div className='flex justify-end'>
				<UpsertRule>
					<Button>
						<PlusIcon />
						<span>Add Rule</span>
					</Button>
				</UpsertRule>
			</div>

			{rules?.length ? (
				<DataTable columns={columns} data={rules} defaultState={{ pageSize: 10, sorting: [{ id: 'createdAt', desc: true }] }} />
			) : (
				<div className='flex items-center justify-center rounded-lg border border-dashed shadow-sm p-12'>
					<div className='flex flex-col items-center gap-1 text-center'>
						<h3 className='text-2xl font-bold tracking-tight'>You have no rules</h3>
						<p className='text-sm text-muted-foreground mb-4'>Start by adding a rule.</p>
						<UpsertRule>
							<Button>
								<PlusIcon />
								<span>Add Rule</span>
							</Button>
						</UpsertRule>
					</div>
				</div>
			)}
		</div>
	)
}
