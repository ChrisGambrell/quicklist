import { getErrorRedirect } from '@/utils/helpers'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
	const requestUrl = new URL(request.url)
	const code = requestUrl.searchParams.get('code')

	if (code) {
		const supabase = createClient()

		const { error } = await supabase.auth.exchangeCodeForSession(code)
		if (error) return NextResponse.redirect(getErrorRedirect('/sign-in', error.message))
	}

	redirect('/settings/password')
}
