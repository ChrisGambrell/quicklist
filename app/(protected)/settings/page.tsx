import { getAuth } from '@/utils/_helpers'
import AvatarForm from './forms/avatar-form'
import NameForm from './forms/name-form'

export default async function ProfileSettingsPage() {
	const { user } = await getAuth()

	return (
		<>
			<NameForm user={user} />
			<AvatarForm user={user} />
		</>
	)
}
