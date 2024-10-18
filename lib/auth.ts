import { loginSchema } from '@/validators/auth'
import { PrismaAdapter } from '@auth/prisma-adapter'
import bcrypt from 'bcryptjs'
import NextAuth, { NextAuthConfig } from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import Github from 'next-auth/providers/github'
import Google from 'next-auth/providers/google'
import Resend from 'next-auth/providers/resend'
import prisma from './db'
import { env } from './env'
import { AuthUser } from './utils'

export const authConfig = {
	adapter: PrismaAdapter(prisma),
	callbacks: {
		authorized: ({ auth, request: { nextUrl } }) => {
			const allowedRoutes = ['/', '/forgot', '/login', '/register']

			const isAuthed = !!auth?.user
			const isAuthRoute = allowedRoutes.some((route) => nextUrl.pathname === route)

			if (!isAuthRoute) {
				if (isAuthed) return true
				return false
			} else if (isAuthed) return Response.redirect(new URL('/listings', nextUrl))
			return true
		},
	},
	pages: { signIn: '/login' },
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
		// FIXME: Need to have better email that's being sent
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
		include: { subscriptions: { where: { status: 'active' }, include: { price: { include: { product: true } } } } },
	})
	if (!user) throw new Error('User not found')

	return user
}

export const canGenerate = async (creditsToUse: number): Promise<boolean> => {
	const user = await auth()

	const purchases = await prisma.purchase.findMany({
		where: { userId: user.id },
		include: { price: { include: { product: { include: { amount: true } } } } },
	})
	const purchasedCredits = purchases.reduce((acc, purchase) => acc + (purchase.price.product.amount?.credits ?? 0), 0) + 10

	const generations = await prisma.generation.findMany({ where: { userId: user.id } })
	const usedCredits = generations.reduce((acc, generation) => acc + generation.credits, 0)

	return purchasedCredits - usedCredits >= creditsToUse
}