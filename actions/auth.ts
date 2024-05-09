'use server'

import { parseFormData } from '@/utils/helpers'
import { createClient } from '@/utils/supabase/server'
import { getErrorRedirect, getSuccessRedirect, getURL } from '@cgambrell/utils'
import { Provider } from '@supabase/supabase-js'
import { redirect } from 'next/navigation'
import { z } from 'zod'

const signInWithPasswordSchema = z.object({ email: z.string().email(), password: z.string() })
const signUpSchema = z.object({ name: z.string().min(1), email: z.string().email(), password: z.string() })
const passwordResetSchema = z.object({ email: z.string().email() })

export async function signInWithPassword(_prevState: any, formData: FormData) {
	const { data, errors } = parseFormData(formData, signInWithPasswordSchema)
	if (errors) return { errors }

	const supabase = createClient()

	const { error } = await supabase.auth.signInWithPassword(data)
	if (error) redirect(getErrorRedirect('/sign-in', error.message))

	redirect('/listings')
}

export async function signInWithOAuth(provider: Provider) {
	const supabase = createClient()

	const { data, error } = await supabase.auth.signInWithOAuth({
		provider,
		options: { redirectTo: getURL('/auth/callback') },
	})
	if (error || !data) redirect(getErrorRedirect('/sign-in', error?.message ?? 'An unknown error occured'))

	redirect(data.url)
}

export async function signUp(_prevState: any, formData: FormData) {
	const { data, errors } = parseFormData(formData, signUpSchema)
	if (errors) return { errors }

	const supabase = createClient()

	const { error } = await supabase.auth.signUp({
		email: data.email,
		password: data.password,
		options: { data: { full_name: data.name } },
	})
	if (error) redirect(getErrorRedirect('/sign-up', error.message))

	redirect(getSuccessRedirect('/sign-up', 'Account created successfully. Check your email for verification.'))
}

export async function sendPasswordReset(_prevState: any, formData: FormData) {
	const { data, errors } = parseFormData(formData, passwordResetSchema)
	if (errors) return { errors }

	const supabase = createClient()

	const { error } = await supabase.auth.resetPasswordForEmail(data.email, { redirectTo: getURL('/auth/reset') })
	if (error) redirect(getErrorRedirect('/forgot', error.message))

	redirect(getSuccessRedirect('/forgot', 'Check your email for next steps.'))
}
