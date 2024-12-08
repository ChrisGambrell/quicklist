import { loginSchema } from '@/validators/auth'
import { PrismaAdapter } from '@auth/prisma-adapter'
import bcrypt from 'bcryptjs'
import NextAuth, { NextAuthConfig } from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import Github from 'next-auth/providers/github'
import Google from 'next-auth/providers/google'
import Resend from 'next-auth/providers/resend'
import { env } from 'process'
import prisma from './db'
import { AuthUser } from './utils'

export const authConfig = {
	adapter: PrismaAdapter(prisma),
	callbacks: {
		authorized: ({ auth, request: { nextUrl } }) => {
			const allowedPages = ['/', '/forgot', '/sign-in', '/sign-up']
			const isAuthed = !!auth?.user
			const isAuthRoute = allowedPages.some((page) => nextUrl.pathname === page)

			if (!isAuthRoute) {
				if (isAuthed) return true
				return false
			} else if (isAuthed) return Response.redirect(new URL('/listings', nextUrl))
			return true
		},
	},
	pages: { signIn: '/sign-in' },
	providers: [
		Credentials({
			credentials: { email: {}, password: {} },
			authorize: async (credentials) => {
				const { email, password } = await loginSchema.parseAsync(credentials)
				const user = await prisma.user.findUnique({ where: { email } })

				if (!user) throw new Error('User not found')
				else if (!user.passwordHash) throw new Error('User does not have a password')
				else if (!(await bcrypt.compare(password, user.passwordHash))) throw new Error('Password does not match')

				return user
			},
		}),
		Github({ allowDangerousEmailAccountLinking: true }),
		Google({ allowDangerousEmailAccountLinking: true }),
		Resend({ from: env.AUTH_RESEND_EMAIL }),
	],
	session: { strategy: 'jwt' },
} satisfies NextAuthConfig

export const { handlers, auth: session, signIn, signOut } = NextAuth(authConfig)

export const auth = async (): Promise<AuthUser> => {
	const session = await NextAuth(authConfig).auth()
	if (!session?.user) throw new Error('Not authenticated.')

	const user = await prisma.user.findFirst({
		where: { email: session.user.email ?? '' },
		include: {
			subscriptions: {
				where: { staus: 'active', price: { active: true, product: { active: true } } },
				include: { price: { include: { product: { include: { productAmount: true } } } } },
			},
		},
	})
	if (!user) throw new Error('User not found')

	return user
}
