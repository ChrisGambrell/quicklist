import { z } from 'zod'

export const updateListingSchema = z.object({
	title: z.string().transform((arg) => (!arg.trim() ? null : arg)),
	description: z.string().transform((arg) => (!arg.trim() ? null : arg)),
	price: z
		.string()
		.transform((arg) => (!arg.trim() ? null : arg))
		.pipe(z.coerce.number().nullable()),
})

export const uploadListingImageSchema = z.object({
	file: z.instanceof(File).refine((arg) => arg.size > 0, { message: 'File is required' }),
})
