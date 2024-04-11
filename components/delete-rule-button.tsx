'use client'

import { createClient } from '@/utils/supabase/server'
import { XIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
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

export default function DeleteRuleButton({ ruleId }: { ruleId: string }) {
	const router = useRouter()

	async function handleDelete() {
		// TODO: Needs to be client component
		const supabase = createClient()
		const { error } = await supabase.from('rules').delete().eq('id', ruleId)
		if (error) throw error.message
		router.refresh()
	}

	return (
		<AlertDialog>
			<AlertDialogTrigger asChild>
				<Button size='sm' variant='ghost'>
					<XIcon className='text-destructive w-5 h-5' />
				</Button>
			</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
					<AlertDialogDescription>
						This action cannot be undone. This will permanently delete your rule and remove the data from our servers.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>Cancel</AlertDialogCancel>
					<AlertDialogAction onClick={handleDelete}>Continue</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	)
}
