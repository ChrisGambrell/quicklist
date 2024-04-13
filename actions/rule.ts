'use server'

import { ActionReturn } from '@/utils/helpers'
import { getAuth } from '@/utils/helpers/server'
import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

const createListingSchema = z.object({ rule: z.string().min(1) })

export async function createRule(prevState: any, formData: FormData): Promise<ActionReturn<typeof createListingSchema>> {
	const data = Object.fromEntries(formData)

	const parsed = createListingSchema.safeParse(data)
	if (!parsed.success) return { errors: parsed.error.flatten().fieldErrors }

	const { auth, supabase } = await getAuth()

	const { error } = await supabase.from('rules').insert({ user_id: auth.id, ...parsed.data })
	if (error) return { errors: { _global: [error.message] } }

	revalidatePath('/', 'layout')
	return { successTrigger: true }
}

export async function deleteRule(ruleId: string): Promise<ActionReturn<undefined>> {
	const supabase = createClient()

	const { error } = await supabase.from('rules').delete().eq('id', ruleId)
	if (error) return { errors: { _global: [error.message] } }

	revalidatePath('/', 'layout')
	return { successTrigger: true }
}
