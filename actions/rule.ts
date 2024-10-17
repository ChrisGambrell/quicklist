'use server'

import { auth } from '@/lib/auth'
import prisma from '@/lib/db'
import { parseFormData } from '@/utils/helpers'
import { getSuccessRedirect } from '@cgambrell/utils'
import { Rule } from '@prisma/client'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { z } from 'zod'

const updateRuleSchema = z.object({ rule: z.string().transform((arg) => (!arg.trim() ? null : arg)) })

export async function createRule() {
	const user = await auth()
	const newRule = await prisma.rule.create({ data: { userId: user.id } })

	revalidatePath('/rules', 'layout')
	redirect(`/rules/${newRule.id}/edit`)
}

export async function updateRule({ ruleId }: { ruleId: Rule['id'] }, _prevState: any, formData: FormData) {
	const { data, errors } = parseFormData(formData, updateRuleSchema)
	if (errors) return { errors }

	await prisma.rule.update({ where: { id: ruleId }, data })

	redirect(getSuccessRedirect(`/rules/${ruleId}/edit`, 'Rule updated'))
}

export async function deleteRule({ ruleId }: { ruleId: Rule['id'] }) {
	await prisma.rule.delete({ where: { id: ruleId } })

	redirect(getSuccessRedirect('/rules', 'Rule deleted'))
}
