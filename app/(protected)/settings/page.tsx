import { getAuth } from '@/utils/helpers'
import NameForm from './forms/name-form'

export default async function ProfileSettingsPage() {
	const { user } = await getAuth()

	return <NameForm user={user} />
}
