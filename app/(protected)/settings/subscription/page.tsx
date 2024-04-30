import { getAuth } from '@/utils/_helpers'
import { createClient } from '@/utils/supabase/server'
import { ProductWithPrices, SubscriptionWithPriceWithProductWithAmount } from '@/utils/types'
import SubscriptionForm from '../forms/subscription-form'
import Pricing from './pricing'

export default async function SubscriptionSettings() {
	const supabase = createClient()
	const { user } = await getAuth()

	const { data: products } = await supabase
		.from('products')
		.select('*, prices(*)')
		.eq('active', true)
		.eq('prices.active', true)
		.order('metadata->index')
		.returns<ProductWithPrices[]>()

	const { data: subscription } = await supabase
		.from('subscriptions')
		.select('*, price:prices(*, product:products(*, amount:product_amounts(*)))')
		.eq('user_id', user.id)
		.eq('status', 'active')
		.eq('prices.active', true)
		.eq('prices.products.active', true)
		.returns<SubscriptionWithPriceWithProductWithAmount>()
		.maybeSingle()

	return subscription ? <SubscriptionForm subscription={subscription} /> : <Pricing products={products ?? []} />
}
