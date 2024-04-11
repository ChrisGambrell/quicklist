import DeleteRuleButton from '@/components/delete-rule-button'
import { Listing } from '@/components/listing'
import NewUploadForm from '@/components/new-upload-form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { createClient } from '@/utils/supabase/server'
import { PlusIcon, XIcon } from 'lucide-react'
import { addRule } from './actions'

export const dynamic = 'force-dynamic'

export default async function RootPage() {
	const supabase = createClient()
	const { data: listings } = await supabase.from('listings').select()
	const { data: rules } = await supabase.from('rules').select()

	return (
		<div className='max-w-4xl p-2 grid gap-8 sm:mx-auto sm:my-8'>
			<div className='space-y-2'>
				<h3 className='tracking-tight font-bold'>Upload new item</h3>
				<NewUploadForm />
				<div className='text-sm italic'>When you select a photo, it will automatically upload and generate eBay metadata.</div>
			</div>
			<Separator />
			<div className='grid gap-2'>
				<h3 className='tracking-tight font-bold'>Rules</h3>

				<form action={addRule} className='grid gap-2'>
					{rules?.map((rule) => (
						<div key={rule.id} className='flex space-x-1 items-center'>
							<div className='flex-1'>- {rule.rule}</div>
							<div className='flex-shrink-0'>
								<DeleteRuleButton ruleId={rule.id} />
							</div>
						</div>
					))}
					<Input id='rule' name='rule' placeholder='Add a new rule' />
					<Button className='sm:w-fit'>Update</Button>
				</form>
			</div>
			<Separator />
			<div className='grid gap-2'>
				<h3 className='tracking-tight font-bold'>Uploaded items</h3>
				<div className='grid gap-6'>
					{listings?.map((listing) => (
						<Listing key={listing.id} listing={listing} />
					))}
				</div>
			</div>
		</div>
	)
}
