import { User } from '@prisma/client'
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export type AuthUser = User

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}
