import icon from '@/app/icon.png'
import Image from 'next/image'
import Link from 'next/link'

export default function Logo({ size }: { size: number }) {
	return <Image src={icon} alt='QuickList' className='rounded-lg' height={size} width={size} />
}

export function LogoLink({ size }: { size: number }) {
	return (
		<Link className='flex-shrink-0' href='/'>
			<Logo size={size} />
			<span className='sr-only'>QuickList</span>
		</Link>
	)
}
