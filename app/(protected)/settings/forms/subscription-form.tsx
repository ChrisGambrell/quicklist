import { updateName } from '@/actions/user'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { SubscriptionWithPriceWithProductWithAmount } from '@/utils/types'
import ManageSubscriptionButton from './manage-subscription-button'

export default function SubscriptionForm({ subscription }: { subscription: SubscriptionWithPriceWithProductWithAmount }) {
	return (
		<form action={updateName}>
			<Card>
				<CardHeader>
					<CardTitle>Your Subscription</CardTitle>
					<CardDescription>Manage your subscription.</CardDescription>
				</CardHeader>
				<CardContent>
					<h6 className='text-xl font-semibold'>{subscription.price.product.name}</h6>
					<p>
						${(subscription.price.unit_amount ?? 0) / 100}/{subscription.price.interval}
					</p>
					<p>{subscription.price.product.amount.listing_amount} listings/month</p>
					<p>{subscription.price.product.amount.rule_amount} rules</p>
				</CardContent>
				<CardFooter className='border-t px-6 py-4'>
					<ManageSubscriptionButton />
				</CardFooter>
			</Card>
		</form>
	)
}
