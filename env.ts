import { createEnv } from '@t3-oss/env-nextjs'
import { z } from 'zod'

export const env = createEnv({
	server: {
		OPENAI_KEY: z.string().min(1),

		STRIPE_SECRET_KEY: z.string().min(1),
		STRIPE_WEBHOOK_SECRET: z.string().min(1),

		SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),

		// SUPABASE_AUTH_EXTERNAL_GITHUB_CLIENT_ID: z.string().min(1),
		// SUPABASE_AUTH_EXTERNAL_GITHUB_SECRET: z.string().min(1),
		// SUPABASE_AUTH_EXTERNAL_GITHUB_REDIRECT_URI: z.string().url(),

		// SUPABASE_AUTH_EXTERNAL_GOOGLE_CLIENT_ID: z.string().min(1),
		// SUPABASE_AUTH_EXTERNAL_GOOGLE_SECRET: z.string().min(1),
		// SUPABASE_AUTH_EXTERNAL_GOOGLE_REDIRECT_URI: z.string().url(),
	},
	client: {
		NEXT_PUBLIC_SITE_URL: z.string().url(),
		NEXT_PUBLIC_NGROK_URL: z.string().url().optional(),

		NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
		NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),

		NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string().min(1),
	},
	runtimeEnv: {
		OPENAI_KEY: process.env.OPENAI_KEY,

		STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
		STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,

		SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,

		// SUPABASE_AUTH_EXTERNAL_GITHUB_CLIENT_ID: process.env.SUPABASE_AUTH_EXTERNAL_GITHUB_CLIENT_ID,
		// SUPABASE_AUTH_EXTERNAL_GITHUB_SECRET: process.env.SUPABASE_AUTH_EXTERNAL_GITHUB_SECRET,
		// SUPABASE_AUTH_EXTERNAL_GITHUB_REDIRECT_URI: process.env.SUPABASE_AUTH_EXTERNAL_GITHUB_REDIRECT_URI,

		// SUPABASE_AUTH_EXTERNAL_GOOGLE_CLIENT_ID: process.env.SUPABASE_AUTH_EXTERNAL_GOOGLE_CLIENT_ID,
		// SUPABASE_AUTH_EXTERNAL_GOOGLE_SECRET: process.env.SUPABASE_AUTH_EXTERNAL_GOOGLE_SECRET,
		// SUPABASE_AUTH_EXTERNAL_GOOGLE_REDIRECT_URI: process.env.SUPABASE_AUTH_EXTERNAL_GOOGLE_REDIRECT_URI,

		NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
		NEXT_PUBLIC_NGROK_URL: process.env.NEXT_PUBLIC_NGROK_URL,

		NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
		NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,

		NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
	},
})
