'use server'

import { ActionReturn } from '@/utils/helpers'
import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

const updateUserSchema = z.object({ full_name: z.string().transform((arg) => (!arg.trim() ? null : arg)) })
const updatePasswordSchema = z.object({ password: z.string().min(8).optional(), confirm_password: z.string().optional() })

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

export async function updatePassword(prevState: any, formData: FormData): Promise<ActionReturn<typeof updatePasswordSchema>> {
	const data = Object.fromEntries(formData)

	const parsed = updatePasswordSchema.safeParse(data)
	if (!parsed.success) return { errors: parsed.error.flatten().fieldErrors }

	if (!!parsed.data.password && parsed.data.password !== parsed.data.confirm_password)
		return { errors: { confirm_password: ['Passwords do not match'] } }

	const supabase = createClient()

	const { error } = await supabase.auth.updateUser({ password: parsed.data.password })
	if (error) return { errors: { _global: [error.message] } }

	revalidatePath('/settings', 'layout')
}
