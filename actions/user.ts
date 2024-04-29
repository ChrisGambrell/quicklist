'use server'

import { getAuth } from '@/utils/_helpers'
import { getErrorRedirect, getSuccessRedirect, parseFormData } from '@/utils/helpers'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { z } from 'zod'

const updateNameSchema = z.object({ full_name: z.string().transform((arg) => (!arg.trim() ? null : arg)) })
const updateAvatarSchema = z.object({ avatar: z.instanceof(File) })
const updatePasswordSchema = z.object({ password: z.string().min(8).optional(), confirm_password: z.string().optional() })

export async function updateName(formData: FormData) {
	const { data, errors } = parseFormData(formData, updateNameSchema)
	if (errors) return { errors }

	const { auth, supabase } = await getAuth()

	const { error } = await supabase.from('users').update(data).eq('id', auth.id)
	if (error) redirect(getErrorRedirect('/settings', error.message))

	redirect(getSuccessRedirect('/settings', 'Name updated'))
}

export async function updateAvatar(formData: FormData) {
	const { data, errors } = parseFormData(formData, updateAvatarSchema)
	if (errors) return { errors }
	else if (data.avatar.size === 0) redirect(getErrorRedirect('/settings', 'File must not be empty'))

	const { user, supabase } = await getAuth()

	const file = data.avatar
	const fileExt = file.name.split('.').pop()
	const filePath = `${user.id}/${new Date().getTime()}-${Math.random()}.${fileExt}`

	const { error: uploadError } = await supabase.storage.from('avatars').upload(filePath, file)
	if (uploadError) redirect(getErrorRedirect('/settings', uploadError.message))

	const { data: uploadedAvatar } = await supabase.storage.from('avatars').getPublicUrl(filePath)

	const { error: updateUserError } = await supabase.from('users').update({ avatar_url: uploadedAvatar.publicUrl }).eq('id', user.id)
	if (updateUserError) redirect(getErrorRedirect('/settings', updateUserError.message))

	redirect(getSuccessRedirect('/settings', 'Avatar updated'))
}

export async function updatePassword(_prevState: any, formData: FormData) {
	const { data, errors } = parseFormData(formData, updatePasswordSchema)
	if (errors) return { errors }

	if (!!data.password && data.password !== data.confirm_password) return { errors: { confirm_password: ['Passwords do not match'] } }

	const supabase = createClient()

	const { error } = await supabase.auth.updateUser({ password: data.password })
	if (error) redirect(getErrorRedirect('/settings/password', error.message))

	redirect(getSuccessRedirect('/settings/password', 'Password updated'))
}
