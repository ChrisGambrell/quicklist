'use client'

import { getStripe } from '@/utils/stripe/client'
import { checkoutWithStripe } from '@/utils/stripe/server'
import { ProductWithPrices } from '@/utils/types'
import { getErrorRedirect } from '@cgambrell/utils'
import { usePathname, useRouter } from 'next/navigation'
import { DropdownMenuItem, DropdownMenuShortcut } from '../ui/dropdown-menu'

export default function AddCreditsButton({ product }: { product: ProductWithPrices }) {
	const pathname = usePathname()
	const router = useRouter()

	const price = product.prices[0]
	if (!price || !price.unit_amount) return null

	const handleStripeCheckout = async () => {
		const { errorRedirect, sessionId } = await checkoutWithStripe(price, pathname)

		if (errorRedirect) return router.push(errorRedirect)
		if (!sessionId) return router.push(getErrorRedirect(pathname, 'An unknown error occurred.'))

		const stripe = await getStripe()
		stripe?.redirectToCheckout({ sessionId })
	}

	return (
		<DropdownMenuItem onClick={handleStripeCheckout}>
			<span>{product.name}</span>
			<DropdownMenuShortcut>${price.unit_amount / 100}</DropdownMenuShortcut>
		</DropdownMenuItem>
	)
}
