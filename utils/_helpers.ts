import { getErrorRedirect } from '@cgambrell/utils'
import { redirect } from 'next/navigation'
import { createClient } from './supabase/server'
import { SubscriptionWithPriceWithProductWithAmount } from './types'

export async function getAuth() {
	const supabase = createClient()

	const { data: auth, error: authError } = await supabase.auth.getUser()
	if (authError || !auth.user) redirect('/')

	const { data: user, error: userError } = await supabase.from('users').select().eq('id', auth.user.id).maybeSingle()
	if (userError || !user) redirect(getErrorRedirect('/', userError?.message ?? "FATAL: User's profile not found."))

	const { data: subscription, error: subscriptionError } = await supabase
		.from('subscriptions')
		.select('*, price:prices(*, product:products(*, amount:product_amounts(*)))')
		.eq('user_id', user.id)
		.eq('status', 'active')
		.eq('prices.active', true)
		.eq('prices.products.active', true)
		.returns<SubscriptionWithPriceWithProductWithAmount>()
		.maybeSingle()
	if (subscriptionError) redirect(getErrorRedirect('/', subscriptionError.message))

	return { auth: auth.user, user, subscription, supabase }
}

export async function getRemainingCredits() {
	const { supabase } = await getAuth()

	const { data: purchasedCredits } = await supabase.rpc('get_total_credits')
	const { data: usedCredits } = await supabase.rpc('get_used_credits')

	return (purchasedCredits ?? 0) - (usedCredits ?? 0)
}
