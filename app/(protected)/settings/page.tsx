import { auth } from '@/lib/auth'
import AvatarForm from './forms/avatar-form'
import NameForm from './forms/name-form'

export default async function ProfileSettingsPage() {
	const user = await auth()

	return (
		<>
			<NameForm user={user} />
			<AvatarForm user={user} />
		</>
	)
}
