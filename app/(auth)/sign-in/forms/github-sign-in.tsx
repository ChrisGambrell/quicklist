import { signInWithOAuth } from '@/actions/auth'
import ActionButton from '@/components/action-button'
import { GithubIcon } from 'lucide-react'

export default function GitHubSignIn() {
	const signInWithGitHub = signInWithOAuth.bind(null, 'github')

	return (
		<form action={signInWithGitHub}>
			<ActionButton formAction={signInWithGitHub} className='w-full' variant='outline'>
				<GithubIcon className='mr-2 h-5 w-5' />
				Sign in with GitHub
			</ActionButton>
		</form>
	)
}
