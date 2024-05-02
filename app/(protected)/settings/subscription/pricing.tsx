'use client'

import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { getStripe } from '@/utils/stripe/client'
import { checkoutWithStripe } from '@/utils/stripe/server'
import { BillingInterval, Price, ProductWithPrices } from '@/utils/types'
import { getErrorRedirect } from '@cgambrell/utils'
import { Loader2Icon } from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'

export default function Pricing({ products }: { products: ProductWithPrices[] }) {
	const pathname = usePathname()
	const router = useRouter()
	const [billingInterval, setBillingInterval] = useState<BillingInterval>('month')
	const [priceIdLoading, setPriceIdLoading] = useState<string>()

	const handleStripeCheckout = async (price: Price) => {
		setPriceIdLoading(price.id)

		const { errorRedirect, sessionId } = await checkoutWithStripe(price, pathname)

		if (errorRedirect) {
			setPriceIdLoading(undefined)
			return router.push(errorRedirect)
		}

		if (!sessionId) {
			setPriceIdLoading(undefined)
			return router.push(getErrorRedirect(pathname, 'An unknown error occurred.'))
		}

		const stripe = await getStripe()
		stripe?.redirectToCheckout({ sessionId })

		setPriceIdLoading(undefined)
	}

	return (
		<>
			<div className='sm:flex sm:flex-col sm:align-center mx-auto'>
				<Tabs
					className='w-[350px]'
					value={billingInterval as string}
					onValueChange={(value) => setBillingInterval(value as BillingInterval)}>
					<TabsList className='grid grid-cols-2'>
						<TabsTrigger value='month'>Monthly</TabsTrigger>
						<TabsTrigger value='year'>Yearly</TabsTrigger>
					</TabsList>
				</Tabs>
			</div>
			<div className='space-y-4 sm:space-y-0 grid sm:flex flex-wrap justify-center gap-6 lg:max-w-4xl lg:mx-auto xl:max-w-none xl:mx-0'>
				<div className='flex flex-col rounded-lg shadow-sm bg-white border flex-1 basis-1/3 max-w-xs'>
					<div className='p-6'>
						<h2 className='text-2xl font-semibold leading-6'>Free</h2>
						<p className='mt-4 text-foreground/50'>
							Perfect for those testing the waters providing unlimited listings, and 5 rules.
						</p>
						<p className='mt-8'>
							<span className='text-5xl font-extrabold'>$0</span>
							<span className='text-base font-medium text-foreground/80'>/{billingInterval}</span>
						</p>
						<Button className='mt-8 w-full' disabled>
							Current plan
						</Button>
					</div>
				</div>

				{products.map((product) => {
					const price = product?.prices?.find((price) => price.interval === billingInterval)
					if (!price) return null
					const priceString = new Intl.NumberFormat('en-US', {
						style: 'currency',
						currency: price.currency!,
						minimumFractionDigits: 0,
					}).format((price?.unit_amount || 0) / 100)
					return (
						<div key={product.id} className='flex flex-col rounded-lg shadow-sm bg-white border flex-1 basis-1/3 max-w-xs'>
							<div className='p-6'>
								<h2 className='text-2xl font-semibold leading-6'>{product.name}</h2>
								<p className='mt-4 text-foreground/50'>{product.description}</p>
								<p className='mt-8'>
									<span className='text-5xl font-extrabold'>{priceString}</span>
									<span className='text-base font-medium text-foreground/80'>/{billingInterval}</span>
								</p>
								<Button
									className='w-full mt-8'
									disabled={priceIdLoading === price.id}
									onClick={() => handleStripeCheckout(price)}>
									{priceIdLoading ? <Loader2Icon className='w-5 h-5 animate-spin' /> : 'Subscribe'}
								</Button>
							</div>
						</div>
					)
				})}
			</div>
		</>
	)
}
