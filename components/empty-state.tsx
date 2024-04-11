import { LucideIcon } from 'lucide-react'

export function EmptyState({
	buttonType = 'button',
	icon: Icon,
	type,
}: {
	buttonType?: 'button' | 'submit'
	icon: LucideIcon
	type: string
}) {
	return (
		<button
			type={buttonType}
			className='relative block w-full rounded-lg border-2 border-dashed border-gray-300 p-12 text-center hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2'>
			<Icon className='w-10 h-10 sm:w-12 sm:h-12 mx-auto text-gray-400 stroke-1' />
			<span className='mt-2 block text-sm font-semibold text-gray-500'>Create a new {type}</span>
		</button>
	)
}
