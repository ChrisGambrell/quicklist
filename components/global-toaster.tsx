'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'
import toast, { Toaster } from 'react-hot-toast'

export default function GlobalToaster() {
	const pathname = usePathname()
	const router = useRouter()
	const searchParams = useSearchParams()

	useEffect(() => {
		const success = searchParams.get('success')
		const success_description = searchParams.get('success_description')
		const error = searchParams.get('error')
		const error_description = searchParams.get('error_description')

		if (!success && !error) return
		const toastType = success ? toast.success : toast.error
		toastType(success ? success_description : error_description)

		const newSearchParams = new URLSearchParams(searchParams.toString())
		const paramsToRemove = ['success', 'success_description', 'error', 'error_description']
		paramsToRemove.forEach((param) => newSearchParams.delete(param))
		const redirectPath = `${pathname}?${newSearchParams.toString()}`
		router.replace(redirectPath, { scroll: false })
	}, [searchParams])

	return <Toaster />
}
