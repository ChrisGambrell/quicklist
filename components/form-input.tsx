import { cn } from '@/lib/utils'
import { ComponentProps } from 'react'
import { FormError } from './form-error'
import { Input } from './ui/input'
import { Label } from './ui/label'

type FormInputProps = ComponentProps<'input'> & { desc?: string; error?: string[]; label?: string }

export function FormInput({ className, error, id, label, name, ...props }: FormInputProps) {
	return (
		<div className={cn('grid gap-2 h-fit', className)}>
			{label && <Label htmlFor={id ?? name}>{label}</Label>}
			<Input id={id ?? name} name={name ?? id} {...props} />
			<FormError value={error} />
		</div>
	)
}
