import { EmptyState } from '@/components/empty-state'
import { getAuth } from '@/utils/helpers/server'
import { ScaleIcon } from 'lucide-react'
import NewRuleButton from '../../(newlayout)/rules/new-rule-button'
import Rule from '../../(newlayout)/rules/rule'
import PasswordForm from './components/password-form'
import ProfileForm from './components/profile-form'

export default async function SettingsPage() {
	const { user, supabase } = await getAuth()
	const { data: rules } = await supabase.from('rules').select().order('created_at', { ascending: true })

	return (
		<div className='grid gap-4 sm:gap-8'>
			<ProfileForm user={user} />
			<PasswordForm />

			<div className='grid gap-4'>
				<div className='flex items-end space-x-4'>
					<div className='flex-1'>
						<h2 className='tracking-tight font-bold text-3xl'>My Rules</h2>
					</div>
					<div className='flex-shrink-0'>
						<NewRuleButton />
					</div>
				</div>
				<div className='grid gap-2'>
					{!rules || rules.length === 0 ? (
						<EmptyState icon={ScaleIcon} type='rule' />
					) : (
						rules.map((rule) => <Rule key={rule.id} rule={rule} />)
					)}
				</div>
			</div>
		</div>
	)
}
