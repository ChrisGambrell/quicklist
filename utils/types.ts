import { ReactNode } from 'react'

export type CheckoutResponse = {
	errorRedirect?: string
	sessionId?: string
}

export type NavLinkProps = {
	exact?: boolean
	href: string
	icon: ReactNode
	label: string
}
