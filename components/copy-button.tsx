'use client'

import { cn } from '@/lib/utils'
import { CopyIcon } from 'lucide-react'
import { cloneElement } from 'react'
import { Button } from './ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip'

export default function CopyButton({ children, value }: { children: JSX.Element; value: string }) {
	return (
		<div className='relative'>
			{cloneElement(children, { className: cn(children.props.className, 'pr-16') })}
			<div className='absolute top-0 right-0 h-full pr-1.5 pt-1.5'>
				<TooltipProvider>
					<Tooltip>
						<TooltipTrigger asChild>
							<Button className='h-7' type='button' variant='outline' onClick={() => navigator.clipboard.writeText(value)}>
								<CopyIcon className='w-4 h-4' />
							</Button>
						</TooltipTrigger>
						<TooltipContent side='top'>Copy</TooltipContent>
					</Tooltip>
				</TooltipProvider>
			</div>
		</div>
	)
}
