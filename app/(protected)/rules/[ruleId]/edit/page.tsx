import BackButton from '@/components/back-button'
import { createClient } from '@/utils/supabase/server'
import { Rule } from '@/utils/types'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import DeleteRule from './cards/delete-rule'
import RuleForm from './cards/rule-form'

export const metadata: Metadata = {
	title: 'QuickList - Edit Rule',
	description: 'Edit a rule',
}

export default async function EditRulePage({ params: { ruleId } }: { params: { ruleId: Rule['id'] } }) {
	const supabase = createClient()
	const { data: rule } = await supabase.from('rules').select().eq('id', ruleId).maybeSingle()

	if (!rule) return notFound()
	return (
		<div className='mx-auto grid max-w-[59rem] flex-1 auto-rows-max gap-4 w-full'>
			<div className='flex items-center gap-4 overflow-hidden'>
				<div className='flex-shrink-0'>
					<BackButton />
				</div>
				<h1 className='flex-1 whitespace-nowrap text-xl font-semibold tracking-tight truncate'>{rule.rule}</h1>
			</div>
			<div className='grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3'>
				<div className='grid auto-rows-max items-start gap-4 lg:col-span-2'>
					<RuleForm rule={rule} />
				</div>
				<div className='grid auto-rows-max items-start gap-4'>
					<DeleteRule rule={rule} />
				</div>
			</div>
		</div>
	)
}
