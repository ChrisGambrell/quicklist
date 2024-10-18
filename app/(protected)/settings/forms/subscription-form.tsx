import { updateName } from '@/actions/user'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Prisma } from '@prisma/client'
import { ManageSubscriptionButton } from './manage-subscription-button'

export function SubscriptionForm({
	subscription,
}: {
	subscription: Prisma.SubscriptionGetPayload<{ include: { price: { include: { product: { include: { amount: true } } } } } }>
}) {
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
						${(Number(subscription.price.unitAmount) ?? 0) / 100}/{subscription.price.interval}
					</p>
					<p>{subscription.price.product.amount?.listingAmount} listings/month</p>
					<p>{subscription.price.product.amount?.ruleAmount} rules</p>
				</CardContent>
				<CardFooter className='border-t px-6 py-4'>
					<ManageSubscriptionButton />
				</CardFooter>
			</Card>
		</form>
	)
}
