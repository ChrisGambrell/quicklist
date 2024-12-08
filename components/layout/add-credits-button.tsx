'use client'

import { checkoutWithStripe } from '@/actions/stripe'
import { getStripe } from '@/lib/stripe/client'
import { getErrorRedirect } from '@cgambrell/utils'
import { Prisma } from '@prisma/client'
import { Loader2Icon } from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'
import { Button } from '../ui/button'

export default function AddCreditsButton({ product }: { product: Prisma.ProductGetPayload<{ include: { prices: true } }> }) {
	const pathname = usePathname()
	const router = useRouter()
	const [isLoading, setIsLoading] = useState(false)

	const price = product.prices[0]
	if (!price || !price.unitAmount) return null

	const handleStripeCheckout = async () => {
		setIsLoading(true)

		const { errorRedirect, sessionId } = await checkoutWithStripe(price)

		if (errorRedirect) {
			setIsLoading(false)
			return router.push(errorRedirect)
		}

		if (!sessionId) {
			setIsLoading(false)
			return router.push(getErrorRedirect(pathname, 'An unknown error occurred.'))
		}

		const stripe = await getStripe()
		stripe?.redirectToCheckout({ sessionId })

		setIsLoading(false)
	}

	return (
		<Button className='w-full' disabled={isLoading} onClick={handleStripeCheckout}>
			{isLoading ? <Loader2Icon className='w-5 h-5 animate-spin' /> : 'Purchase'}
		</Button>
	)
}
