import { DataTable } from '@/components/data-table'
import { cn } from '@/lib/utils'
import { getAuth } from '@/utils/_helpers'
import { Metadata } from 'next'
import ChatImageUpload from '../chat-image-upload'
import { columns } from './columns'

export const metadata: Metadata = {
	title: 'QuickList - Listings',
	description: 'List of listings and their images and generations',
}

export const maxDuration = 300

export default async function ListingsPage() {
	// const { user, supabase } = await getAuth()
	// const { data: listings } = await supabase
	// 	.from('listings')
	// 	.select('*, generations(*), images:listing_images(*)')
	// 	.eq('user_id', user.id)
	// 	.order('created_at', { ascending: false })
	// 	.order('created_at', { ascending: false, referencedTable: 'generations' })
	// 	.order('is_primary', { ascending: false, referencedTable: 'listing_images' })

	return (
		// <div className={cn('container grid gap-4', { 'pt-4 sm:pt-8 lg:pt-16 xl:pt-20': !listings || listings.length === 0 })}>
		// 	<ChatImageUpload />

		// 	{listings && listings.length > 0 && (
		// 		<DataTable columns={columns} data={listings} defaultState={{ pageSize: 5, sorting: [{ id: 'created_at', desc: true }] }} />
		// 	)}
		// </div>
		<div>hello, world!</div>
	)
}
