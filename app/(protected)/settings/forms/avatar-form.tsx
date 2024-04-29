import { updateAvatar } from '@/actions/user'
import ActionButton from '@/components/action-button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Tables } from '@/db_types'
import { PLACEHOLDER_AVATAR } from '@/utils/constants'
import Image from 'next/image'

export default function AvatarForm({ user }: { user: Tables<'users'> }) {
	return (
		<form action={updateAvatar}>
			<Card>
				<CardHeader>
					<CardTitle>Your Avatar</CardTitle>
					<CardDescription>The picture people see for your account.</CardDescription>
				</CardHeader>
				<CardContent>
					<div className='grid gap-4'>
						<Image
							src={user.avatar_url ?? PLACEHOLDER_AVATAR}
							alt='Listing image'
							className='aspect-square rounded-md object-cover'
							height={128}
							width={128}
						/>
						<Input id='avatar' name='avatar' type='file' />
					</div>
				</CardContent>
				<CardFooter className='border-t px-6 py-4'>
					<ActionButton>Save</ActionButton>
				</CardFooter>
			</Card>
		</form>
	)
}
