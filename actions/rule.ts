'use server'

import { getAuth } from '@/utils/helpers'
import { createClient } from '@/utils/supabase/server'
import { ActionReturn } from '@/utils/types'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { z } from 'zod'

const createRuleSchema = z.object({ rule: z.string().min(1) })
const updateRuleSchema = z.object({ rule: z.string().min(1) })

export async function createRule(prevState: any, formData: FormData): Promise<ActionReturn<typeof createRuleSchema>> {
	const data = Object.fromEntries(formData)

	const parsed = createRuleSchema.safeParse(data)
	if (!parsed.success) return { errors: parsed.error.flatten().fieldErrors }

	const { auth, supabase } = await getAuth()

	const { error } = await supabase.from('rules').insert({ user_id: auth.id, ...parsed.data })
	if (error) return { errors: { _global: [error.message] } }

	revalidatePath('/rules', 'layout')
	return { successTrigger: true }
}

export async function updateRule(id: string, prevState: any, formData: FormData): Promise<ActionReturn<typeof updateRuleSchema>> {
	const data = Object.fromEntries(formData)

	const parsed = updateRuleSchema.safeParse(data)
	if (!parsed.success) return { errors: parsed.error.flatten().fieldErrors }

	const { supabase } = await getAuth()

	const { error } = await supabase.from('rules').update(parsed.data).eq('id', id)
	if (error) return { errors: { _global: [error.message] } }

	revalidatePath('/rules', 'layout')
	return { successTrigger: true }
}

export async function deleteRule(ruleId: string): Promise<ActionReturn<undefined>> {
	const supabase = createClient()

	const { error } = await supabase.from('rules').delete().eq('id', ruleId)
	if (error) return { errors: { _global: [error.message] } }

	redirect('/rules')
}
