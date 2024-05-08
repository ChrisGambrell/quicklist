import AddRuleButton from '@/app/(protected)/rules/add-rule-button'
import Rule from '@/app/(protected)/rules/rule'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { getAuth } from '@/utils/_helpers'
import { Metadata } from 'next'

export const metadata: Metadata = {
	title: 'QuickList - Rules',
	description: 'List of rules',
}

export default async function RulesPage() {
	const { user, supabase } = await getAuth()
	const { data: rules } = await supabase.from('rules').select().eq('user_id', user.id).order('created_at', { ascending: true })

	return (
		<>
			<Card>
				<CardHeader>
					<div className='flex items-start justify-between'>
						<CardTitle>Rules</CardTitle>
						<AddRuleButton />
					</div>
				</CardHeader>
				<CardContent>
					{rules?.length ? (
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Rule</TableHead>
									<TableHead className='hidden md:table-cell'>Created at</TableHead>
									<TableHead>
										<span className='sr-only'>Actions</span>
									</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{rules?.map((rule) => (
									<Rule key={rule.id} rule={rule} />
								))}
							</TableBody>
						</Table>
					) : (
						<div className='flex items-center justify-center rounded-lg border border-dashed shadow-sm p-12'>
							<div className='flex flex-col items-center gap-1 text-center'>
								<h3 className='text-2xl font-bold tracking-tight'>You have no rules</h3>
								<p className='text-sm text-muted-foreground mb-4'>Start by adding a rule.</p>
								<AddRuleButton />
							</div>
						</div>
					)}
				</CardContent>
			</Card>
		</>
	)
}
