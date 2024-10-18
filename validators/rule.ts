import { z } from 'zod'

export const updateRuleSchema = z.object({ rule: z.string().transform((arg) => (!arg.trim() ? null : arg)) })
