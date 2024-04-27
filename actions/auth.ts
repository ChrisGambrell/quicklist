'use server'

import { createClient } from '@/utils/supabase/server'
import { ActionReturn } from '@/utils/types'
import { Provider } from '@supabase/supabase-js'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { z } from 'zod'

const signInWithPasswordSchema = z.object({ email: z.string().email(), password: z.string() })
const signUpSchema = z.object({ name: z.string().min(1), email: z.string().email(), password: z.string() })
const passwordResetSchema = z.object({ email: z.string().email() })

export async function signInWithPassword(_prevState: any, formData: FormData): Promise<ActionReturn<typeof signInWithPasswordSchema>> {
	const data = Object.fromEntries(formData)

	const parsed = signInWithPasswordSchema.safeParse(data)
	if (!parsed.success) return { errors: parsed.error.flatten().fieldErrors }

	const supabase = createClient()

	const { error } = await supabase.auth.signInWithPassword(parsed.data)
	if (error) return { errors: { _global: [error.message] } }

	revalidatePath('/', 'layout')
	redirect('/')
}

export async function signInWithOAuth(provider: Provider): Promise<ActionReturn<undefined>> {
	const supabase = createClient()

	// TODO: When cancelling the OAuth flow, the user is redirected to /auth/confirm with an error message that should be handled by toaster http://127.0.0.1:3000/sign-in#error=access_denied&error_description=The+user+has+denied+your+application+access.
	const { data, error } = await supabase.auth.signInWithOAuth({
		provider,
		options: { redirectTo: `${process.env.NEXTAUTH_URL}/auth/callback` },
	})
	if (error || !data) return { errors: { _global: [error?.message || 'An unknown error occured'] } }

	redirect(data.url)

	// http://127.0.0.1:54321/auth/v1/verify?token=pkce_f70a94ee6ea9994c53f590335206d4c164e895fb75164b557a46eaac&type=recovery&redirect_to=http://127.0.0.1:3000/auth/reset
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
