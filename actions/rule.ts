'use server'

import { getAuth } from '@/utils/_helpers'
import { getErrorRedirect, getSuccessRedirect, parseFormData } from '@/utils/helpers'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { z } from 'zod'

const createRuleSchema = z.object({ rule: z.string().min(1) })
const updateRuleSchema = z.object({ rule: z.string().min(1) })

// TODO: Make sure ActionReturn is not used anymore

export async function createRule(_prevState: any, formData: FormData) {
	const { data, errors } = parseFormData(formData, createRuleSchema)
	if (errors) return { errors }

	const { auth, supabase } = await getAuth()

	const { error } = await supabase.from('rules').insert({ user_id: auth.id, ...data })
	if (error) redirect(getErrorRedirect('/rules', error.message))

	redirect(getSuccessRedirect('/rules', 'Rule created'))
}

export async function updateRule(id: string, _prevState: any, formData: FormData) {
	const { data, errors } = parseFormData(formData, updateRuleSchema)
	if (errors) return { errors }

	const { supabase } = await getAuth()

	const { error } = await supabase.from('rules').update(data).eq('id', id)
	if (error) redirect(getErrorRedirect(`/rules/${id}/edit`, error.message))

	redirect(getSuccessRedirect(`/rules/${id}/edit`, 'Rule updated'))
}

export async function deleteRule(ruleId: string) {
	const supabase = createClient()

	const { error } = await supabase.from('rules').delete().eq('id', ruleId)
	if (error) redirect(getErrorRedirect(`/rules/${ruleId}/edit`, error.message))

	redirect(getSuccessRedirect('/rules', 'Rule deleted'))
}
