'use server'

import { auth } from '@/lib/auth'
import prisma from '@/lib/db'
import { getSuccessRedirect, parseFormData } from '@cgambrell/utils'
import { Rule } from '@prisma/client'
import { redirect } from 'next/navigation'
import { z } from 'zod'

export async function upsertRule({ ruleId }: { ruleId?: Rule['id'] }, _prevState: any, formData: FormData) {
	const { data, errors } = parseFormData(
		formData,
		z.object({ rule: z.string({ required_error: 'Rule is required' }).min(1, { message: 'Rule is required' }) })
	)
	if (errors) return { errors }

	const user = await auth()
	// TODO: Where should slways come last on upsert
	await prisma.rule.upsert({ create: { ...data, userId: user.id }, update: data, where: { id: ruleId ?? '' } })

	redirect(getSuccessRedirect('/rules', 'Rule saved'))
}

export async function deleteRule({ ruleId }: { ruleId: Rule['id'] }) {
	await prisma.rule.delete({ where: { id: ruleId } })
	redirect(getSuccessRedirect('/rules', 'Rule deleted'))
}
