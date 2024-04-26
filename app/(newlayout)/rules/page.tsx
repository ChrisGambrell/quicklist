import AddRuleButton from '@/app/(newlayout)/rules/add-rule-button'
import Rule from '@/app/(newlayout)/rules/rule'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { createClient } from '@/utils/supabase/server'

export default async function RulesPage() {
	const supabase = createClient()
	const { data: rules } = await supabase.from('rules').select().order('created_at', { ascending: true })

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
				</CardContent>
			</Card>
		</>
	)
}
