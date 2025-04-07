'use client'

import { useEffect } from 'react'
import { useFormState } from 'react-dom'
import { toast } from 'sonner'
import { ActionResult } from './types'

export function useForm<T>(action: (_: unknown, formData: FormData) => Promise<ActionResult<T>>) {
	const [formState, formAction] = useFormState(action, {
		success: false,
		fieldErrors: {},
		globalError: null,
		values: {},
	})

	useEffect(() => {
		if (!formState?.globalError) return
		toast.error(formState.globalError)
	}, [formState?.globalError])

	return [formState, formAction] as const
}
