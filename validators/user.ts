import { z } from 'zod'

export const updateAvatarSchema = z.object({ avatar: z.instanceof(File) })

export const updateNameSchema = z.object({ full_name: z.string().transform((arg) => (!arg.trim() ? null : arg)) })

export const updatePasswordSchema = z.object({ password: z.string().min(8).optional(), confirm_password: z.string().optional() })
