import { createClient } from '@/utils/supabase/server'
import { getErrorRedirect } from '@cgambrell/utils'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
	const { searchParams, origin } = new URL(request.url)
	const code = searchParams.get('code')
	// if "next" is in param, use it as the redirect URL
	const next = searchParams.get('next') ?? '/'

	if (!code) return NextResponse.redirect(getErrorRedirect(`${origin}/sign-in`, 'No code provided'))

	const supabase = createClient()

	const { error } = await supabase.auth.exchangeCodeForSession(code)
	if (error) return NextResponse.redirect(getErrorRedirect(`${origin}/sign-in`, error.message))
	return NextResponse.redirect(`${origin}${next}`)
}
