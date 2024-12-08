import AddCreditsButton from '@/components/layout/add-credits-button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import prisma from '@/lib/db'

export default async function PricingPage() {
	// TODO: Check RLS
	// TODO: order by metadata->index
	const products = await prisma.product.findMany({
		where: { active: true, prices: { some: { active: true } } },
		include: { prices: true },
	})

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
									<div className='text-4xl font-bold'>${(product.prices[0].unitAmount ?? 0) / 100}</div>
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
