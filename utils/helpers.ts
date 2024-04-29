import { ZodObject, ZodObjectDef, ZodTypeAny, z } from 'zod'

export const getURL = (path: string = '') => {
	let url =
		process.env.NEXT_PUBLIC_SITE_URL && process.env.NEXT_PUBLIC_SITE_URL.trim() !== ''
			? process.env.NEXT_PUBLIC_SITE_URL
			: process.env.NEXT_PUBLIC_VERCEL_URL && process.env.NEXT_PUBLIC_VERCEL_URL.trim() !== ''
			? process.env.NEXT_PUBLIC_VERCEL_URL
			: 'http://localhost:3000'

	// Trim the URL and remove trailing slash
	url = url.replace(/\/+$/, '')
	// Include https when not localhost
	url = url.includes('http') ? url : `https://${url}`
	// Ensure path starts without a slash to avoid duble slashes
	path = path.replace(/^\/+/, '')

	return path ? `${url}/${path}` : url
}

export const parseFormData = <T extends ZodTypeAny>(
	formData: FormData,
	schema: T
): { data: z.infer<T>; errors?: undefined } | { data?: undefined; errors: z.inferFlattenedErrors<T>['fieldErrors'] } => {
	const data = Object.fromEntries(formData)
	const parsedData = schema.safeParse(data)

	if (!parsedData.success) return { errors: parsedData.error.flatten().fieldErrors }
	return { data: parsedData.data }
}

const toastKeyMap: { [key: string]: string[] } = {
	success: ['success', 'success_description'],
	error: ['error', 'error_description'],
}

const getToastRedirect = (
	path: string,
	toastType: string,
	toastName: string,
	toastDescription: string = '',
	disableButton: boolean = false,
	arbitraryParams: string = ''
) => {
	const [nameKey, descriptionKey] = toastKeyMap[toastType]

	let redirectPath = `${path}?${nameKey}=${encodeURIComponent(toastName)}`
	if (toastDescription) redirectPath += `&${descriptionKey}=${encodeURIComponent(toastDescription)}`
	if (disableButton) redirectPath += '&disable_button=true'
	if (arbitraryParams) redirectPath += `&${arbitraryParams}`

	return redirectPath
}

export const getSuccessRedirect = (
	path: string,
	successDescription: string = '',
	disableButton: boolean = false,
	arbitraryParams: string = ''
) => getToastRedirect(path, 'success', 'Success!', successDescription, disableButton, arbitraryParams)

export const getErrorRedirect = (
	path: string,
	errorDescription: string = '',
	disableButton: boolean = false,
	arbitraryParams: string = ''
) => getToastRedirect(path, 'error', 'Uh oh!', errorDescription, disableButton, arbitraryParams)
