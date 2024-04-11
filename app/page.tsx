import { Listing } from '@/components/listing'
import NewUploadForm from '@/components/new-upload-form'
import { createClient } from '@/utils/supabase/server'

export const dynamic = 'force-dynamic'

export default async function RootPage() {
	const supabase = createClient()
	const { data: listings } = await supabase.from('listings').select()

	return (
		<div className='max-w-4xl p-2 grid gap-4 sm:mx-auto sm:my-8'>
			<div className='space-y-2'>
				<NewUploadForm />
				<div className='text-sm italic'>When you select a photo, it will automatically upload and generate eBay metadata.</div>
			</div>
			<div className='grid gap-6'>
				{listings?.map((listing) => (
					<Listing key={listing.id} listing={listing} />
				))}
			</div>
		</div>
	)
}
