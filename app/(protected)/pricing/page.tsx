import AddCreditsButton from '@/components/layout/add-credits-button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { createClient } from '@/utils/supabase/server'
import { ProductWithPrices } from '@/utils/types'

export default async function Component() {
	const supabase = createClient()
	const { data: products } = await supabase
		.from('products')
		.select('*, prices(*)')
		.eq('active', true)
		.eq('prices.active', true)
		.order('metadata->index')
		.returns<ProductWithPrices[]>()

	return (
		<section className='w-full py-6 md:py-12 lg:py-24'>
			<div className='container px-4 md:px-6 max-w-3xl'>
				<div className='mx-auto max-w-3xl text-center'>
					<h2 className='text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl'>Pricing</h2>
					<p className='mt-4 text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400'>
						Choose the amount of credits that&apos;s right for you.
					</p>
				</div>
				<div className='mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 md:gap-8'>
					{products
						?.filter((product) => product.prices.length)
						.map((product) => (
							<Card key={product.id} className='flex flex-col'>
								<CardHeader>
									<CardTitle>{product.name}</CardTitle>
								</CardHeader>
								<CardContent>
									<div className='text-4xl font-bold'>${(product.prices[0].unit_amount ?? 0) / 100}</div>
								</CardContent>
								<CardFooter>
									<AddCreditsButton product={product} />
								</CardFooter>
							</Card>
						))}
				</div>
			</div>
		</section>
	)
}
