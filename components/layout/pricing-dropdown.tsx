import { createClient } from '@/utils/supabase/server'
import { ProductWithPrices } from '@/utils/types'
import { ChevronDownIcon } from 'lucide-react'
import { Badge } from '../ui/badge'
import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '../ui/dropdown-menu'
import AddCreditsButton from './add-credits-button'

export default async function PricingDropdown() {
	const supabase = createClient()
	const { data: products } = await supabase
		.from('products')
		.select('*, prices(*)')
		.eq('active', true)
		.eq('prices.active', true)
		.order('metadata->index')
		.returns<ProductWithPrices[]>()

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Badge className='cursor-pointer' variant='outline'>
					Add credits
					<ChevronDownIcon className='w-4 h-4 ml-2' />
				</Badge>
			</DropdownMenuTrigger>
			<DropdownMenuContent className='w-48'>
				<DropdownMenuLabel>Add credits</DropdownMenuLabel>
				<DropdownMenuSeparator />
				{products
					?.filter((product) => product.prices.length)
					.map((product) => (
						<AddCreditsButton key={product.id} product={product} />
					))}
			</DropdownMenuContent>
		</DropdownMenu>
	)
}
