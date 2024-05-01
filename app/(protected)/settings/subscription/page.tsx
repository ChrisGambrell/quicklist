import { getAuth } from '@/utils/_helpers'
import { createClient } from '@/utils/supabase/server'
import { ProductWithPrices } from '@/utils/types'
import SubscriptionForm from '../forms/subscription-form'
import Pricing from './pricing'

export default async function SubscriptionSettings() {
	const supabase = createClient()
	const { subscription } = await getAuth()

	const { data: products } = await supabase
		.from('products')
		.select('*, prices(*)')
		.eq('active', true)
		.eq('prices.active', true)
		.order('metadata->index')
		.returns<ProductWithPrices[]>()

	return subscription ? <SubscriptionForm subscription={subscription} /> : <Pricing products={products ?? []} />
}
