import AddListingButton from '@/app/(protected)/listings/add-listing-button'
import { Listing } from '@/app/(protected)/listings/listing'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { createClient } from '@/utils/supabase/server'

export default async function ListingsPage() {
	const supabase = createClient()
	const { data: listings } = await supabase.from('listings').select().order('created_at', { ascending: true })

	return (
		<>
			<Card>
				<CardHeader>
					<div className='flex items-start justify-between'>
						<CardTitle>Listings</CardTitle>
						<AddListingButton />
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
								<h3 className='text-2xl font-bold tracking-tight'>You have no listingss</h3>
								<p className='text-sm text-muted-foreground mb-4'>Start by adding a listing.</p>
								<AddListingButton />
							</div>
						</div>
					)}
				</CardContent>
			</Card>
		</>
	)
}
