import Header from '@/components/layout/header'
import NewGenerationButton from '@/components/layout/new-generation-button'
import UserMenu from '@/components/layout/user-menu'
import { LayoutProps } from '@cgambrell/utils'

export default function ProtectedLayout({ children }: LayoutProps) {
	return (
		<div className='flex min-h-[100dvh] flex-col'>
			<header className='flex items-center px-6 py-4'>
				<Header />

				<div className='ml-auto flex items-center space-x-4'>
					<NewGenerationButton />
					<UserMenu />
				</div>
			</header>

			<main className='w-full py-4 md:py-6 px-4'>{children}</main>
		</div>
	)
}
