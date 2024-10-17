import { createEnv } from '@t3-oss/env-nextjs'
import { z } from 'zod'

export const env = createEnv({
	server: {
		AUTH_SECRET: z.string().min(1),

		AUTH_GITHUB_ID: z.string().min(1),
		AUTH_GITHUB_SECRET: z.string().min(1),

		AUTH_GOOGLE_ID: z.string().min(1),
		AUTH_GOOGLE_SECRET: z.string().min(1),

		AUTH_RESEND_KEY: z.string().min(1),
		AUTH_RESEND_EMAIL: z.string().email(),

		AWS_ACCESS_KEY_ID: z.string().min(1),
		AWS_SECRET_ACCESS_KEY: z.string().min(1),
		AWS_REGION: z.string().min(1),
		AWS_BUCKET_NAME: z.string().min(1),

		DATABASE_URL: z.string().url(),

		OPENAI_KEY: z.string().min(1),

		STRIPE_SECRET_KEY: z.string().min(1),
		STRIPE_WEBHOOK_SECRET: z.string().min(1),
	},
	client: {
		NEXT_PUBLIC_SITE_URL: z.string().url(),
		NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string().min(1),
	},
	runtimeEnv: {
		AUTH_SECRET: process.env.AUTH_SECRET,

		AUTH_GITHUB_ID: process.env.AUTH_GITHUB_ID,
		AUTH_GITHUB_SECRET: process.env.AUTH_GITHUB_SECRET,

		AUTH_GOOGLE_ID: process.env.AUTH_GOOGLE_ID,
		AUTH_GOOGLE_SECRET: process.env.AUTH_GOOGLE_SECRET,

		AUTH_RESEND_KEY: process.env.AUTH_RESEND_KEY,
		AUTH_RESEND_EMAIL: process.env.AUTH_RESEND_EMAIL,

		AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
		AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
		AWS_REGION: process.env.AWS_REGION,
		AWS_BUCKET_NAME: process.env.AWS_BUCKET_NAME,

		DATABASE_URL: process.env.DATABASE_URL,

		OPENAI_KEY: process.env.OPENAI_KEY,

		STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
		STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,

		NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
		NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
	},
})
