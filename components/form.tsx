import { ActionErrors } from '@/utils/helpers'
import { useEffect } from 'react'
import { useFormState } from 'react-dom'
import { UseFormStateProps } from 'react-hook-form'
import toast from 'react-hot-toast'
import { ZodTypeAny } from 'zod'

export const useErrorToaster = (toasts?: string[] | undefined) => {
	useEffect(() => {
		if (!toasts?.length) return
		toasts.forEach((t) => toast.error(t))
	}, [toasts])
}

export const useSuccessTrigger = (trigger: boolean | undefined, callback: () => void) => {
	useEffect(() => {
		if (!trigger) return
		callback()
	}, [callback, trigger])
}

export function FormError<T extends ZodTypeAny>({ errors, id }: { errors?: ActionErrors<T>; id: keyof ActionErrors<T> }) {
	if (!errors || !errors[id] || !errors[id]!.length) return null
	return <div className='text-destructive text-sm'>{errors[id]![0]}</div>
}
