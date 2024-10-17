import { Prisma } from '@prisma/client'
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export type AuthUser = Prisma.UserGetPayload<{}>

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}
