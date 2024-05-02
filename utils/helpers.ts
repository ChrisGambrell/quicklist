import { ZodTypeAny, z } from 'zod'

export const toDateTime = (secs: number) => {
	var t = new Date(+0)
	t.setSeconds(secs)
	return t
}

export const calculateTrialEndUnixTimestamp = (trialPeriodDays: number | null | undefined) => {
	// Check if trialPeriodDays is null, undefined, or less than 2 days
	if (trialPeriodDays === null || trialPeriodDays === undefined || trialPeriodDays < 2) {
		return undefined
	}

	const currentDate = new Date() // Current date and time
	const trialEnd = new Date(currentDate.getTime() + (trialPeriodDays + 1) * 24 * 60 * 60 * 1000) // Add trial days
	return Math.floor(trialEnd.getTime() / 1000) // Convert to Unix timestamp in seconds
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
