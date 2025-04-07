'use server'

import { handleFormAction } from '@/components/ui/f/action'
import { signIn, signOut } from '@/lib/auth'
import prisma from '@/lib/db'
import { getErrorRedirect, getSuccessRedirect } from '@/lib/utils'
import { registerSchema, verifyEmailSchema } from '@/validators/auth'
import { Prisma } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { AuthError } from 'next-auth'
import { BuiltInProviderType } from 'next-auth/providers'
import { redirect } from 'next/navigation'

export const login = async (_: unknown, formData: FormData) =>
	handleFormAction(formData, registerSchema, async (data) => {
		try {
			await signIn('credentials', { email: data.email, password: data.password, redirectTo: '/listings' })
		} catch (error) {
			if (error instanceof AuthError) return { globalError: error.cause?.err?.message }
			throw error
		}

		redirect('/listings')
	})

export async function logout() {
	await signOut({ redirectTo: '/login' })
}

export async function oauth(provider: BuiltInProviderType) {
	// TODO: Callback url

	try {
		await signIn(provider, { redirectTo: '/dashboard' })
	} catch (error) {
		if (error instanceof AuthError) redirect(getErrorRedirect('/login'))
		throw error
	}
}

export const register = async (_: unknown, formData: FormData) =>
	handleFormAction(formData, registerSchema, async (data) => {
		try {
			const passwordHash = await bcrypt.hash(data.password, 10)
			await prisma.user.create({ data: { name: `${data.firstName} ${data.lastName}`, email: data.email, passwordHash } })
		} catch (error) {
			if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002')
				return { errors: { email: ['User already exists with that email'] } }
			else if (error instanceof AuthError) return { globalError: error.cause?.err?.message }
			throw error
		}

		redirect(getSuccessRedirect('/login', 'Account created, please login'))
	})

export const verifyEmail = async (_prevState: unknown, formData: FormData) =>
	handleFormAction(formData, verifyEmailSchema, async (data) => {
		try {
			await signIn('resend', { email: data.email, redirect: false })
		} catch (error) {
			if (error instanceof AuthError) redirect(getErrorRedirect('/forgot', error.cause?.err?.message))
			throw error
		}

		redirect(getSuccessRedirect('/login', 'A sign in link has been sent to your email address.'))
	})
