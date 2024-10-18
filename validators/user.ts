import { z } from 'zod'

export const updateAvatarSchema = z.object({ avatar: z.instanceof(File).refine((arg) => arg.size > 0, { message: 'Avatar is required' }) })

export const updateNameSchema = z.object({ full_name: z.string().transform((arg) => (!arg.trim() ? null : arg)) })

// TODO: Need to have good error messages with validators
export const updatePasswordSchema = z
	.object({
		password: z.string({ required_error: 'Password is required' }).min(8, { message: 'Password must be at least 8 characters' }),
		confirmPassword: z.string({ required_error: 'Password confirmation is required' }),
	})
	.refine(({ password, confirmPassword }) => password === confirmPassword, {
		message: 'Passwords do not match',
		path: ['confirmPassword'],
	})
