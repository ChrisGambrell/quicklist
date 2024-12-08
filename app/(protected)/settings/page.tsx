import { auth } from '@/lib/auth'
import NameForm from './forms/name-form'

export default async function ProfileSettingsPage() {
	const user = await auth()

	return (
		<>
			<NameForm user={user} />
			{/* TODO: Re-add avatar form */}
			{/* <AvatarForm user={user} /> */}
		</>
	)
}
