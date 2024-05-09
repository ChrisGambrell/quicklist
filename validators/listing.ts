import { z } from 'zod'

// TODO: Move all validators to file
export const updateListingSchema = z.object({
	title: z.string().transform((arg) => (!arg.trim() ? null : arg)),
	description: z.string().transform((arg) => (!arg.trim() ? null : arg)),
	price: z
		.string()
		.transform((arg) => (!arg.trim() ? null : arg))
		.pipe(z.coerce.number().nullable()),
})
