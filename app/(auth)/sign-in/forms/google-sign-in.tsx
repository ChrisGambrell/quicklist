import { signInWithOAuth } from '@/actions/auth'
import ActionButton from '@/components/action-button'
import { ChromeIcon } from 'lucide-react'

export default function GoogleSignIn() {
	const signInWithGoogle = signInWithOAuth.bind(null, 'google')

	return (
		<form action={signInWithGoogle}>
			<ActionButton formAction={signInWithGoogle} className='w-full' variant='outline'>
				<ChromeIcon className='mr-2 h-5 w-5' />
				Sign in with Google
			</ActionButton>
		</form>
	)
}
