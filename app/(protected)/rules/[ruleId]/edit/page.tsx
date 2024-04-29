import { Tables } from '@/db_types'
import { createClient } from '@/utils/supabase/server'
import { notFound } from 'next/navigation'
import EditRuleClient from './edit-rule-client'

export default async function EditRulePage({ params: { ruleId } }: { params: { ruleId: Tables<'rules'>['id'] } }) {
	const supabase = createClient()
	const { data: rule } = await supabase.from('rules').select().eq('id', ruleId).maybeSingle()

	if (!rule) return notFound()
	return <EditRuleClient rule={rule} />
}
