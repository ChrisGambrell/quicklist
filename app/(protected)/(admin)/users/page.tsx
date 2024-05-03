import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { cn } from '@/lib/utils'
import { PLACEHOLDER_AVATAR } from '@/utils/constants'
import { createClient } from '@/utils/supabase/server'
import Image from 'next/image'

export default async function UsersPage() {
	const supabase = createClient()

	const { data: users } = await supabase.from('users').select().order('created_at', { ascending: false })
	const { data: generations } = await supabase.from('generations').select()
	const { data: subscriptions } = await supabase
		.from('subscriptions')
		.select('*, price:prices(*, product:products(*, amount:product_amounts(*)))')
		.eq('status', 'active')
		.eq('prices.active', true)
		.eq('prices.products.active', true)

	return (
		<>
			<Card>
				<CardHeader>
					<CardTitle>Users</CardTitle>
				</CardHeader>
				<CardContent>
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead className='w-[64px] sm:w-[100px] sm:table-cell'>
									<span className='sr-only'>Avatar</span>
								</TableHead>
								<TableHead>Name</TableHead>
								{/* TODO: Show purchased? */}
								<TableHead className='hidden md:table-cell'>Generations</TableHead>
								<TableHead>Credits Used</TableHead>
								<TableHead className='hidden lg:table-cell'>Email address</TableHead>
								<TableHead className='hidden md:table-cell'>Created at</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{users?.map((user) => (
								<TableRow key={user.id}>
									<TableCell className='min-w-[64px] sm:min-w-[100px]'>
										<Image
											src={user.avatar_url ? user.avatar_url : PLACEHOLDER_AVATAR}
											alt='Listing image'
											className='aspect-square rounded-md object-cover'
											height={64}
											width={64}
										/>
									</TableCell>
									<TableCell className={cn(user.is_admin ? 'font-black' : 'font-medium')}>
										{user.full_name ?? '-'}
									</TableCell>
									<TableCell className='hidden md:table-cell'>
										{generations?.filter((generation) => generation.user_id === user.id).length ?? '-'}
									</TableCell>
									<TableCell>
										{generations
											?.filter((generation) => generation.user_id === user.id)
											.reduce((prev, curr) => prev + curr.credits, 0) ?? '-'}
									</TableCell>
									<TableCell className='hidden lg:table-cell'>{user.email}</TableCell>
									<TableCell className='hidden md:table-cell'>{new Date(user.created_at).toDateString()}</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</CardContent>
			</Card>
		</>
	)
}
