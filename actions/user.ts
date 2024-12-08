'use server'

import { auth } from '@/lib/auth'
import prisma from '@/lib/db'
import { updateNameSchema, updatePasswordSchema } from '@/validators/user'
import { getSuccessRedirect, parseFormData } from '@cgambrell/utils'
import bcrypt from 'bcryptjs'
import { redirect } from 'next/navigation'

export async function updateName(_prevState: any, formData: FormData) {
	const { data, errors } = parseFormData(formData, updateNameSchema)
	if (errors) return { errors }

	const user = await auth()
	await prisma.user.update({ where: { id: user.id }, data: { name: data.name } })

	redirect(getSuccessRedirect('/settings', 'Name updated'))
}

// TODO: Reactivate update avatar
// export async function updateAvatar(formData: FormData) {
// 	const { data, errors } = parseFormData(formData, updateAvatarSchema)
// 	if (errors) return { errors }
// 	else if (data.avatar.size === 0) redirect(getErrorRedirect('/settings', 'File must not be empty'))

// 	const { user, supabase } = await getAuth()

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

export async function updatePassword(_prevState: any, formData: FormData) {
	const { data, errors } = parseFormData(formData, updatePasswordSchema)
	if (errors) return { errors }

	// TODO: Handle in validator
	if (!!data.password && data.password !== data.confirmPassword) return { errors: { confirmPassword: ['Passwords do not match'] } }

	const user = await auth()

	const passwordHash = await bcrypt.hash(data.password, 10)
	await prisma.user.update({ where: { id: user.id }, data: { passwordHash } })

	redirect(getSuccessRedirect('/settings/password', 'Password updated'))
}
