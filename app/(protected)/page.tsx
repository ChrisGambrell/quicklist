import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import ChatImageUpload from './chat-image-upload'

export default async function RootPage() {
	return (
		<Card className='w-full mx-auto max-w-sm sm:my-20'>
			<CardHeader className='text-center'>
				<CardTitle className='text-2xl'>Generate a listing</CardTitle>
				<CardDescription>Generate details just based on images!</CardDescription>
			</CardHeader>
			<CardContent>
				<ChatImageUpload />
			</CardContent>
		</Card>
	)
}
