'use client'

import { generateListingData } from '@/utils/helpers'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from './ui/alert-dialog'
import { Button } from './ui/button'

export default function RegenerateButton({ listingId }: { listingId: string }) {
	const router = useRouter()
	const [isLoading, setIsLoading] = useState(false)

	async function regenerate() {
		setIsLoading(true)
		await generateListingData(listingId)
		setIsLoading(false)
		router.refresh()
	}

	return (
		<AlertDialog>
			<AlertDialogTrigger asChild>
				<Button className='sm:w-fit' disabled={isLoading} type='button' variant='secondary'>
					Regenerate from images
				</Button>
			</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
					<AlertDialogDescription>
						This action cannot be undone. This will permanently overwrite your listing&apos;s data.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>Cancel</AlertDialogCancel>
					<AlertDialogAction onClick={regenerate}>Continue</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	)
}
