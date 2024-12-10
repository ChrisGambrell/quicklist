import { ActionButton } from '@/components/action-button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { PLACEHOLDER_AVATAR } from '@/lib/constants'
import { User } from '@prisma/client'
import Image from 'next/image'

export default function AvatarForm({ user }: { user: User }) {
	return (
		// TODO: Need to update avatar
		// <form action={updateAvatar}>
		<form>
			<Card>
				<CardHeader>
					<CardTitle>Your Avatar</CardTitle>
					<CardDescription>The picture people see for your account.</CardDescription>
				</CardHeader>
				<CardContent>
					<div className='grid gap-4'>
						<Image
							src={user.image ?? PLACEHOLDER_AVATAR}
							alt='Listing image'
							className='aspect-square rounded-md object-cover'
							height={128}
							width={128}
						/>
						<Input id='avatar' name='avatar' type='file' accept='image/*' />
					</div>
				</CardContent>
				<CardFooter className='border-t px-6 py-4'>
					<ActionButton>Save</ActionButton>
				</CardFooter>
			</Card>
		</form>
	)
}
