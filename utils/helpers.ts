import { ZodTypeAny, z } from 'zod'

export type ActionErrors<T extends ZodTypeAny | undefined> = T extends ZodTypeAny
	? z.inferFlattenedErrors<T>['fieldErrors'] & { _global?: string[] | undefined }
	: { _global?: string[] | undefined }

export type ActionReturn<T extends ZodTypeAny | undefined> = void | {
	errors?: ActionErrors<T>
	successTrigger?: boolean | undefined
}

export type SignedImage = {
	error: string | null
	path: string | null
	signedUrl: string
}
