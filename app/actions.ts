'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function addRule(formData: FormData) {
	const rule = formData.get('rule') as string
	if (!rule || !rule.trim()) return

	const supabase = createClient()
	await supabase.from('rules').insert({ rule })

	revalidatePath('/', 'layout')
}
