import { getAuth } from '@/utils/_helpers'
import NameForm from './forms/name-form'

export default async function ProfileSettingsPage() {
	const { user } = await getAuth()

	return <NameForm user={user} />
}
