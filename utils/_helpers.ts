import { redirect } from 'next/navigation'
import { createClient } from './supabase/server'

export async function getAuth() {
	const supabase = createClient()

	const { data: auth, error: authError } = await supabase.auth.getUser()
	// TODO: Search for all "redirect('" and make sure there's a message attached to it
	if (authError || !auth.user) redirect('/sign-in')

	const { data: user, error: userError } = await supabase.from('users').select().eq('id', auth.user.id).maybeSingle()
	if (userError || !user) redirect('/sign-in')

	return { auth: auth.user, user, supabase }
}

export async function getListingImages({ listingId }: { listingId: string }) {
	const supabase = createClient()

	const { data: files } = await supabase.storage.from('listings').list(listingId)
	if (!files) return null

	const { data: images } = await supabase.storage.from('listings').createSignedUrls(
		files.map((file) => `${listingId}/${file.name}`),
		60 * 60 * 24
	)

	return images
}
