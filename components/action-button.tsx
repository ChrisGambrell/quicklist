'use client'

import { Loader2Icon } from 'lucide-react'
import { useFormStatus } from 'react-dom'
import { Button, ButtonProps } from './ui/button'

export default function ActionButton({ children, disabled, ...props }: ButtonProps) {
	const { pending } = useFormStatus()
	return (
		<Button disabled={disabled || pending} {...props}>
			{pending ? <Loader2Icon className='w-5 h-5 animate-spin' /> : children}
		</Button>
	)
}
