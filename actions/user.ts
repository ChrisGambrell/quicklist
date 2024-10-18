'use server'

import { auth } from '@/lib/auth'
import prisma from '@/lib/db'
import { updateAvatarSchema, updateNameSchema, updatePasswordSchema } from '@/validators/user'
import { getSuccessRedirect, parseFormData } from '@cgambrell/utils'
import bcrypt from 'bcryptjs'
import { redirect } from 'next/navigation'
import { uploadFile } from './s3'

export async function updateName(formData: FormData) {
	const { data, errors } = parseFormData(formData, updateNameSchema)
	if (errors) return { errors }

	const user = await auth()
	await prisma.user.update({ where: { id: user.id }, data })

	redirect(getSuccessRedirect('/settings', 'Name updated'))
}

export async function updateAvatar(formData: FormData) {
	const { data, errors } = parseFormData(formData, updateAvatarSchema)
	if (errors) return { errors }

	const user = await auth()

	const url = await uploadFile(data.avatar, `avatars/${user.id}`)
	await prisma.user.update({ where: { id: user.id }, data: { image: url } })

	redirect(getSuccessRedirect('/settings', 'Avatar updated'))
}

export async function updatePassword(_prevState: any, formData: FormData) {
	const { data, errors } = parseFormData(formData, updatePasswordSchema)
	if (errors) return { errors }

	const user = await auth()
	const passwordHash = await bcrypt.hash(data.password, 10)
	await prisma.user.update({ where: { id: user.id }, data: { passwordHash } })

	redirect(getSuccessRedirect('/settings/security', 'Password updated'))
}
