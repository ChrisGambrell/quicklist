'use server'

import { ActionReturn } from '@/utils/helpers'
import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

const updateUserSchema = z.object({ full_name: z.string().transform((arg) => (!arg.trim() ? null : arg)) })

export async function updateUser(userId: string, prevState: any, formData: FormData): Promise<ActionReturn<typeof updateUserSchema>> {
	const data = Object.fromEntries(formData)

	const parsed = updateUserSchema.safeParse(data)
	if (!parsed.success) return { errors: parsed.error.flatten().fieldErrors }

	const supabase = createClient()

	const { error } = await supabase
		.from('users')
		.update({ ...parsed.data })
		.eq('id', userId)
	if (error) return { errors: { _global: [error.message] } }

	revalidatePath('/settings', 'layout')
}
