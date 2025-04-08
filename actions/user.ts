'use server'

import { auth } from '@/lib/auth'
import prisma from '@/lib/db'
import { getSuccessRedirect } from '@/lib/utils'
import { parseFormData } from '@/utils/helpers'
import { redirect } from 'next/navigation'
import { z } from 'zod'

const updateNameSchema = z.object({ full_name: z.string().transform((arg) => (!arg.trim() ? null : arg)) })
const updateAvatarSchema = z.object({ avatar: z.instanceof(File) })
const updatePasswordSchema = z.object({ password: z.string().min(8).optional(), confirm_password: z.string().optional() })

export async function updateName(formData: FormData) {
	const { data, errors } = parseFormData(formData, updateNameSchema)
	if (errors) return { errors }
	const user = await auth()

	await prisma.user.update({ where: { id: user.id }, data })
	redirect(getSuccessRedirect('/settings', 'Name updated'))
}

// TODO: Update avatar
// export async function updateAvatar(formData: FormData) {
// 	const { data, errors } = parseFormData(formData, updateAvatarSchema)
// 	if (errors) return { errors }
// 	else if (data.avatar.size === 0) redirect(getErrorRedirect('/settings', 'File must not be empty'))

// 	const { user, supabase } = await auth()

// 	const file = data.avatar
// 	const fileExt = file.name.split('.').pop()
// 	const filePath = `${user.id}/${new Date().getTime()}-${Math.random()}.${fileExt}`

// 	const { error: uploadError } = await supabase.storage.from('avatars').upload(filePath, file)
// 	if (uploadError) redirect(getErrorRedirect('/settings', uploadError.message))

// 	const { data: uploadedAvatar } = await supabase.storage.from('avatars').getPublicUrl(filePath)

// 	const { error: updateUserError } = await supabase.from('users').update({ avatar_url: uploadedAvatar.publicUrl }).eq('id', user.id)
// 	if (updateUserError) redirect(getErrorRedirect('/settings', updateUserError.message))

// 	redirect(getSuccessRedirect('/settings', 'Avatar updated'))
// }

// TODO: Update password
// export async function updatePassword(_prevState: any, formData: FormData) {
// 	const { data, errors } = parseFormData(formData, updatePasswordSchema)
// 	if (errors) return { errors }
// 	const user = await auth()

// 	if (!!data.password && data.password !== data.confirm_password) return { errors: { confirm_password: ['Passwords do not match'] } }

// 	const passwordHash = await bcrypt.hash(data.password, 10)
// 	await prisma.user.update({where: {id: user.id, passwordHash: }})
// 	const { error } = await supabase.auth.updateUser({ password: data.password })
// 	if (error) redirect(getErrorRedirect('/settings/password', error.message))

// 	redirect(getSuccessRedirect('/settings/password', 'Password updated'))
// }
