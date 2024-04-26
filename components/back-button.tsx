'use client'

import { ChevronLeftIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Button } from './ui/button'

export default function BackButton() {
	const router = useRouter()

	return (
		<Button className='h-7 w-7' size='icon' type='button' variant='outline' onClick={() => router.back()}>
			<ChevronLeftIcon className='h-4 w-4' />
			<span className='sr-only'>Back</span>
		</Button>
	)
}
