'use server'

import { getAuth } from '@/utils/_helpers'
import { createClient } from '@/utils/supabase/server'
import { Rule } from '@/utils/types'
import { getErrorRedirect, getSuccessRedirect, parseFormData } from '@cgambrell/utils'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { z } from 'zod'

const updateRuleSchema = z.object({ rule: z.string().transform((arg) => (!arg.trim() ? null : arg)) })

export async function createRule() {
	const { auth, supabase } = await getAuth()

	const { data, error } = await supabase.from('rules').insert({ user_id: auth.id }).select().single()
	if (error || !data) redirect(getErrorRedirect('/rules', error.message ?? 'An unexpected error occurred'))

	revalidatePath('/rules', 'layout')
	redirect(`/rules/${data.id}/edit`)
}

export async function updateRule({ ruleId }: { ruleId: Rule['id'] }, _prevState: any, formData: FormData) {
	const { data, errors } = parseFormData(formData, updateRuleSchema)
	if (errors) return { errors }

	const { supabase } = await getAuth()

	const { error } = await supabase.from('rules').update(data).eq('id', ruleId)
	if (error) redirect(getErrorRedirect(`/rules/${ruleId}/edit`, error.message))

	redirect(getSuccessRedirect(`/rules/${ruleId}/edit`, 'Rule updated'))
}

export async function deleteRule({ ruleId }: { ruleId: Rule['id'] }) {
	const supabase = createClient()

	const { error } = await supabase.from('rules').delete().eq('id', ruleId)
	if (error) redirect(getErrorRedirect(`/rules/${ruleId}/edit`, error.message))

	redirect(getSuccessRedirect('/rules', 'Rule deleted'))
}
