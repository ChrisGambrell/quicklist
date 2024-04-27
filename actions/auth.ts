'use server'

import { createClient } from '@/utils/supabase/server'
import { ActionReturn } from '@/utils/types'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { z } from 'zod'

const signInSchema = z.object({ email: z.string().email(), password: z.string() })
const signUpSchema = z.object({ name: z.string().min(1), email: z.string().email(), password: z.string() })
const passwordResetSchema = z.object({ email: z.string().email() })

export async function signIn(_prevState: any, formData: FormData): Promise<ActionReturn<typeof signInSchema>> {
	const data = Object.fromEntries(formData)

	const parsed = signInSchema.safeParse(data)
	if (!parsed.success) return { errors: parsed.error.flatten().fieldErrors }

	const supabase = createClient()

	const { error } = await supabase.auth.signInWithPassword(parsed.data)
	if (error) return { errors: { _global: [error.message] } }

	revalidatePath('/', 'layout')
	redirect('/')
}

export async function signUp(prevState: any, formData: FormData): Promise<ActionReturn<typeof signUpSchema>> {
	const data = Object.fromEntries(formData)

	const parsed = signUpSchema.safeParse(data)
	if (!parsed.success) return { errors: parsed.error.flatten().fieldErrors }

	const supabase = createClient()

	const { error } = await supabase.auth.signUp({
		email: parsed.data.email,
		password: parsed.data.password,
		options: { data: { full_name: parsed.data.name } },
	})
	if (error) return { errors: { _global: [error.message] } }

	return { successTrigger: true }
}

export async function sendPasswordReset(prevState: any, formData: FormData): Promise<ActionReturn<typeof passwordResetSchema>> {
	const data = Object.fromEntries(formData)

	const parsed = passwordResetSchema.safeParse(data)
	if (!parsed.success) return { errors: parsed.error.flatten().fieldErrors }

	const supabase = createClient()

	const { error } = await supabase.auth.resetPasswordForEmail(parsed.data.email, { redirectTo: `${process.env.NEXTAUTH_URL}/auth/reset` })
	if (error) return { errors: { _global: [error.message] } }

	return { successTrigger: true }
}
