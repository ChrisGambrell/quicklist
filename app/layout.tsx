import GlobalToaster from '@/components/global-toaster'
import '@/env'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Suspense } from 'react'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
	title: 'QuickList',
	description: 'A tool to help generate e-commerce listings quickly',
}

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang='en'>
			<body className={inter.className}>
				{children}
				<Suspense>
					<GlobalToaster />
				</Suspense>
			</body>
		</html>
	)
}
