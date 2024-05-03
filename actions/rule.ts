'use server'

import { getAuth } from '@/utils/_helpers'
import { parseFormData } from '@/utils/helpers'
import { createClient } from '@/utils/supabase/server'
import { Rule } from '@/utils/types'
import { getErrorRedirect, getSuccessRedirect } from '@cgambrell/utils'
import { redirect } from 'next/navigation'
import { z } from 'zod'

const createRuleSchema = z.object({ rule: z.string().min(1) })
const updateRuleSchema = z.object({ rule: z.string().min(1) })

export async function createRule(_prevState: any, formData: FormData) {
	const { data, errors } = parseFormData(formData, createRuleSchema)
	if (errors) return { errors }

	const { auth, supabase } = await getAuth()

	const { error } = await supabase.from('rules').insert({ user_id: auth.id, ...data })
	if (error) redirect(getErrorRedirect('/rules', error.message))

	redirect(getSuccessRedirect('/rules', 'Rule created'))
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
