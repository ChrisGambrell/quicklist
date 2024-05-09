import { createListing } from '@/actions/listing'
import ActionButton from '@/components/action-button'
import { DataTable } from '@/components/data-table'
import { getAuth } from '@/utils/_helpers'
import { PlusCircleIcon } from 'lucide-react'
import { Metadata } from 'next'
import { columns } from './columns'

export const metadata: Metadata = {
	title: 'QuickList - Listings',
	description: 'List of listings and their images and generations',
}

export default async function ListingsPage() {
	const { user, supabase } = await getAuth()
	const { data: listings } = await supabase
		.from('listings')
		.select('*, generations(*), images:listing_images(*)')
		.eq('user_id', user.id)
		.order('created_at', { ascending: false })
		.order('created_at', { ascending: false, referencedTable: 'generations' })
		.order('is_primary', { ascending: false, referencedTable: 'listing_images' })

	return (
		<div className='container grid gap-4'>
			<form action={createListing} className='flex justify-end'>
				<ActionButton className='gap-1' size='sm'>
					<PlusCircleIcon className='w-3.5 h-3.5' />
					Add Listing
				</ActionButton>
			</form>

			{listings?.length ? (
				<DataTable columns={columns} data={listings} defaultState={{ sorting: [{ id: 'created_at', desc: true }] }} />
			) : (
				<div className='flex items-center justify-center rounded-lg border border-dashed shadow-sm p-12'>
					<div className='flex flex-col items-center gap-1 text-center'>
						<h3 className='text-2xl font-bold tracking-tight'>You have no listings</h3>
						<p className='text-sm text-muted-foreground'>Start by adding a listing.</p>
						<form action={createListing} className='mt-4'>
							<ActionButton>Add Listing</ActionButton>
						</form>
					</div>
				</div>
			)}
		</div>
	)
}
