'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createListing() {
	const supabase = createClient()
	const { data } = await supabase.from('listings').insert({}).select().single()
	if (data) redirect(`/listing/${data.id}`)
}

export async function createRule(formData: FormData) {
	const rule = formData.get('rule') as string
	if (!rule || !rule.trim()) return

	const supabase = createClient()
	await supabase.from('rules').insert({ rule })

	revalidatePath('/', 'layout')
}
