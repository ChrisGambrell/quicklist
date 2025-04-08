'use client'

import { Button } from '@/components/ui/button'
import { createStripePortal } from '@/lib/stripe/server'
import { Loader2Icon } from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'

export default function ManageSubscriptionButton() {
	const pathname = usePathname()
	const router = useRouter()
	const [isSubmitting, setIsSubmitting] = useState(false)

	const handleStripePortalRequest = async () => {
		setIsSubmitting(true)
		const redirectUrl = await createStripePortal(pathname)
		setIsSubmitting(false)

		return router.push(redirectUrl)
	}

	return (
		<Button disabled={isSubmitting} onClick={handleStripePortalRequest}>
			{isSubmitting ? <Loader2Icon className='w-5 h-5 animate-spin' /> : 'Manage'}
		</Button>
	)
}
