import { ReactNode } from 'react'

export default function PageView({ action, children, title }: { action: ReactNode; children: ReactNode; title: string }) {
	return (
		<div className='grid gap-4'>
			<div className='flex items-end space-x-4'>
				<div className='flex-1'>
					<h2 className='tracking-tight font-bold text-3xl'>{title}</h2>
				</div>
				<div className='flex-shrink-0'>{action}</div>
			</div>
			<div className='grid gap-2'>{children}</div>
		</div>
	)
}
