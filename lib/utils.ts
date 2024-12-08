import { Prisma, User } from '@prisma/client'
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export type AuthUser = Prisma.UserGetPayload<{
	include: { subscriptions: { include: { price: { include: { product: { include: { productAmount: true } } } } } } }
}>

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}
