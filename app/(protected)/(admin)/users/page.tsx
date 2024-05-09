import { DataTable } from '@/components/data-table'
import { createClient } from '@/utils/supabase/server'
import { UserWithGenerationsAndPurchases } from '@/utils/types'
import { Metadata } from 'next'
import { columns } from './columns'

export const metadata: Metadata = {
	title: 'QuickList - Users',
	description: 'List of users and their purchases and credits',
}

export default async function UsersPage() {
	const supabase = createClient()

	const { data: users } = await supabase
		.from('users')
		.select('*, generations(*), purchases(*, price:prices(*, product:products(*, product_amount:product_amounts(*))))')
		.order('created_at', { ascending: false })
		.returns<UserWithGenerationsAndPurchases[]>()

	return <DataTable columns={columns} data={users ?? []} defaultState={{ sorting: [{ id: 'purchased', desc: true }] }} />
}
