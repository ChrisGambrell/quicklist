import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
	title: 'eBay Lister',
	description: 'A tool to help generate eBay listings',
}

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang='en'>
			<body className={inter.className}>
				<div className='max-w-4xl p-2 sm:mx-auto sm:my-8'>{children}</div>
			</body>
		</html>
	)
}
