import { Tables } from '@/db_types'
import { redirect } from 'next/navigation'
import { getErrorRedirect } from './helpers'
import { createClient } from './supabase/server'
import { SubscriptionWithPriceWithProductWithAmount } from './types'

export async function getAuth() {
	const supabase = createClient()

	const { data: auth, error: authError } = await supabase.auth.getUser()
	if (authError || !auth.user) redirect('/sign-in')

	const { data: user, error: userError } = await supabase.from('users').select().eq('id', auth.user.id).maybeSingle()
	if (userError || !user) redirect(getErrorRedirect('/sign-in', userError?.message ?? "FATAL: User's profile not found."))

	const { data: subscription, error: subscriptionError } = await supabase
		.from('subscriptions')
		.select('*, price:prices(*, product:products(*, amount:product_amounts(*)))')
		.eq('user_id', user.id)
		.eq('status', 'active')
		.eq('prices.active', true)
		.eq('prices.products.active', true)
		.returns<SubscriptionWithPriceWithProductWithAmount>()
		.maybeSingle()
	if (subscriptionError) redirect(getErrorRedirect('/sign-in', subscriptionError.message))

	return { auth: auth.user, user, subscription, supabase }
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
