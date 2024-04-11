'use client'

import { generateListingData } from '@/utils/helpers'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Button } from './ui/button'

export default function RegenerateButton({ listingId }: { listingId: string }) {
	const router = useRouter()
	const [isLoading, setIsLoading] = useState(false)

	async function regenerate() {
		setIsLoading(true)
		await generateListingData(listingId)
		router.refresh()
	}

	return (
		<Button className='sm:w-fit' disabled={isLoading} variant='secondary' onClick={regenerate}>
			Regenerate from images
		</Button>
	)
}
