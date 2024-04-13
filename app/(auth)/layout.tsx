import { ReactNode } from 'react'

export default function AuthLayout({ children }: { children: ReactNode }) {
	return <div className='max-w-md border rounded-lg shadow p-4 sm:mx-auto sm:my-8'>{children}</div>
}
