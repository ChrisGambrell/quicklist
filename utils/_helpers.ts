import { Tables } from '@/db_types'
import { redirect } from 'next/navigation'
import { getErrorRedirect } from './helpers'
import { createClient } from './supabase/server'

export async function getAuth() {
	const supabase = createClient()

	const { data: auth, error: authError } = await supabase.auth.getUser()
	if (authError || !auth.user)
		redirect(getErrorRedirect('/sign-in', authError?.message ?? 'You need to be signed in to access this page'))

	const { data: user, error: userError } = await supabase.from('users').select().eq('id', auth.user.id).maybeSingle()
	if (userError || !user) redirect(getErrorRedirect('/sign-in', userError?.message))

	return { auth: auth.user, user, supabase }
}

export async function getListingImages({ listingId }: { listingId: Tables<'listings'>['id'] }) {
	const supabase = createClient()

	const { data: files } = await supabase.storage.from('listings').list(listingId)
	if (!files) return null

	const { data: images } = await supabase.storage.from('listings').createSignedUrls(
		files.map((file) => `${listingId}/${file.name}`),
		60 * 60 * 24
	)

	return images
}
