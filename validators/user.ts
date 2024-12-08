import { z } from 'zod'

export const updateNameSchema = z.object({
	name: z.string({ required_error: 'Name needs to be a string' }).transform((arg) => (!arg.trim() ? null : arg)),
})

export const updateAvatarSchema = z.object({ avatar: z.instanceof(File, { message: 'Avatar needs to be a file' }) })

export const updatePasswordSchema = z.object({
	password: z.string({ required_error: 'Password needs to be a string' }).min(8, { message: 'Password must be at least 8 characters' }),
	confirmPassword: z.string({ required_error: 'Password confirmation needs to be a string' }),
})
