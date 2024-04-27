import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
	const requestUrl = new URL(request.url)
	const code = requestUrl.searchParams.get('code')

	if (code) {
		const supabase = createClient()

		const { error } = await supabase.auth.exchangeCodeForSession(code)
		// TODO: Global toaster for server and client
		// if (error) return getErrorRedirect('/login', 'Uh oh!', `An error occurred: ${error.message}`)
		if (error) throw error.message
	}

	redirect('/settings/password')
}
