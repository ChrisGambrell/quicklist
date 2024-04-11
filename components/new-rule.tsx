import { createRule } from '@/app/actions'
import { ReactNode } from 'react'
import { Button } from './ui/button'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog'
import { Input } from './ui/input'

export default function NewRule({ trigger }: { trigger: ReactNode }) {
	return (
		<Dialog>
			<DialogTrigger asChild>{trigger}</DialogTrigger>
			<DialogContent>
				<form action={createRule} className='grid gap-4'>
					<DialogHeader>
						<DialogTitle>New Rule</DialogTitle>
						<DialogDescription>Add a rule that is followed when generating listing details automatically.</DialogDescription>
					</DialogHeader>
					<Input name='rule' placeholder='Rule' />
					<DialogFooter className='sm:justify-start'>
						<Button>Create</Button>
						<DialogClose asChild>
							<Button type='button' variant='secondary'>
								Close
							</Button>
						</DialogClose>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	)
}
