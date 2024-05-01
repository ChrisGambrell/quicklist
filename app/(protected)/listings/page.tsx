import { createListing } from '@/actions/listing'
import { Listing } from '@/app/(protected)/listings/listing'
import ActionButton from '@/components/action-button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { getAuth } from '@/utils/_helpers'
import { PlusCircleIcon } from 'lucide-react'

export default async function ListingsPage() {
	const { user, supabase } = await getAuth()
	const { data: listings } = await supabase.from('listings').select().eq('user_id', user.id).order('created_at', { ascending: true })

	return (
		<>
			<Card>
				<CardHeader>
					<div className='flex items-start justify-between'>
						<CardTitle>Listings</CardTitle>
						<form action={createListing}>
							<ActionButton size='sm' className='h-8 gap-1'>
								<PlusCircleIcon className='w-3.5 h-3.5' />
								Add Listing
							</ActionButton>
						</form>
					</div>
				</CardHeader>
				<CardContent>
					{listings?.length ? (
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead className='hidden w-[100px] sm:table-cell'>
										<span className='sr-only'>Image</span>
									</TableHead>
									<TableHead>Title</TableHead>
									<TableHead className='hidden md:table-cell'>Price</TableHead>
									<TableHead className='hidden md:table-cell'>Created at</TableHead>
									<TableHead>
										<span className='sr-only'>Actions</span>
									</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{listings?.map((listing) => (
									<Listing key={listing.id} listing={listing} />
								))}
							</TableBody>
						</Table>
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
				</CardContent>
			</Card>
		</>
	)
}
