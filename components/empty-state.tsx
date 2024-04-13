import { LucideIcon } from 'lucide-react'

export function EmptyState({ icon: Icon, type }: { icon: LucideIcon; type: string }) {
	return (
		<div className='relative block w-full rounded-lg border-2 border-dashed border-gray-300 p-12 text-center'>
			<Icon className='w-10 h-10 sm:w-12 sm:h-12 mx-auto text-gray-400 stroke-1' />
			<span className='mt-2 block text-sm font-semibold text-gray-500'>Create a new {type} to see them here</span>
		</div>
	)
}
