'use server'

import { auth, signIn, signOut } from '@/lib/auth'
import prisma from '@/lib/db'
import { loginSchema, registerSchema, updateProfileSchema, verifyEmailSchema } from '@/validators/auth'
import { getErrorRedirect, getSuccessRedirect, parseFormData } from '@cgambrell/utils'
import { Prisma } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { AuthError } from 'next-auth'
import { BuiltInProviderType } from 'next-auth/providers'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function login(_prevState: unknown, formData: FormData) {
	const { data, errors } = parseFormData(formData, loginSchema)
	if (errors) return { errors }

	try {
		await signIn('credentials', { email: data.email, password: data.password, redirectTo: '/' })
	} catch (error) {
		if (error instanceof AuthError) redirect(getErrorRedirect('/sign-in', error.cause?.err?.message))
		throw error
	}
}

export async function logout() {
	await signOut({ redirectTo: '/sign-in' })
}

// BUG: No oauth is working
export async function oauth(provider: BuiltInProviderType) {
	try {
		await signIn(provider, { redirectTo: '/' })
	} catch (error) {
		if (error instanceof AuthError) redirect(getErrorRedirect('/sign-in', error.cause?.err?.message))
		throw error
	}
}

export async function register(_prevState: unknown, formData: FormData) {
	const { data, errors } = parseFormData(formData, registerSchema)
	if (errors) return { errors }

	try {
		const passwordHash = await bcrypt.hash(data.password, 10)
		await prisma.user.create({ data: { name: `${data.firstName} ${data.lastName}`, email: data.email, passwordHash } })
	} catch (error) {
		if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002')
			return { errors: { email: ['User already exists with that email'] } }
		else if (error instanceof AuthError) redirect(getErrorRedirect('/sign-up', error.cause?.err?.message))
		throw error
	}

	redirect(getSuccessRedirect('/sign-in', 'Account created, please login'))
}

export async function updateProfile(_prevState: unknown, formData: FormData) {
	const { data, errors } = parseFormData(formData, updateProfileSchema)
	if (errors) return { errors }

	const user = await auth()
	await prisma.user.update({ data, where: { id: user.id } })

	revalidatePath('/')
	redirect(getSuccessRedirect('/settings', ' Successfully updated your profile.'))
}

export async function verifyEmail(_prevState: unknown, formData: FormData) {
	const { data, errors } = parseFormData(formData, verifyEmailSchema)
	if (errors) return { errors }

	try {
		await signIn('resend', { email: data.email, redirect: false })
	} catch (error) {
		if (error instanceof AuthError) redirect(getErrorRedirect('/forgot', error.cause?.err?.message))
		throw error
	}

	redirect(getSuccessRedirect('/sign-in', 'A sign in link has been sent to your email address.'))
}
