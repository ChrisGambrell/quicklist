import { updateName } from '@/actions/user'
import ActionButton from '@/components/action-button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { User } from '@/utils/types'

export default function NameForm({ user }: { user: User }) {
	return (
		<form action={updateName}>
			<Card>
				<CardHeader>
					<CardTitle>Your Name</CardTitle>
					<CardDescription>Your full name on your account.</CardDescription>
				</CardHeader>
				<CardContent>
					<Input name='full_name' placeholder='Your Name' defaultValue={user.full_name ?? ''} />
				</CardContent>
				<CardFooter className='border-t px-6 py-4'>
					<ActionButton>Save</ActionButton>
				</CardFooter>
			</Card>
		</form>
	)
}
