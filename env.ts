import { createEnv } from '@t3-oss/env-nextjs'
import { z } from 'zod'

export const env = createEnv({
	server: {
		OPENAI_KEY: z.string().min(1),
	},
	client: {
		NEXT_PUBLIC_SITE_URL: z.string().url(),
		NEXT_PUBLIC_NGROK_URL: z.string().url().optional(),

		NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
		NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
	},
	runtimeEnv: {
		OPENAI_KEY: process.env.OPENAI_KEY,

		NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
		NEXT_PUBLIC_NGROK_URL: process.env.NEXT_PUBLIC_NGROK_URL,

		NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
		NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
	},
})
