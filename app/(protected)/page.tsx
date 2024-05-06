import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import ChatImageUpload from './chat-image-upload'

export const maxDuration = 300

export default async function RootPage() {
	return (
		<Card className='w-full mx-auto max-w-sm sm:my-20'>
			<CardHeader className='text-center'>
				<CardTitle className='text-2xl'>Generate a listing</CardTitle>
				<CardDescription>
					Upload images and hit generate to get a clever title and description for what you&apos;re trying to sell!
				</CardDescription>
			</CardHeader>
			<CardContent>
				<ChatImageUpload />
			</CardContent>
		</Card>
	)
}
