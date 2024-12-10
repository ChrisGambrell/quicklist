import { cn } from '@/lib/utils'
import { Column } from '@tanstack/react-table'
import { ArrowDownIcon, ArrowUpIcon } from 'lucide-react'
import { Button } from './ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu'

interface ColumnHeaderProps<TData, TValue> extends React.HTMLAttributes<HTMLDivElement> {
	column: Column<TData, TValue>
	title: string
}

export function ColumnHeader<TData, TValue>({ column, title, className }: ColumnHeaderProps<TData, TValue>) {
	if (!column.getCanSort()) {
		return <div className={cn(className)}>{title}</div>
	}

	return (
		<div className={cn('flex items-center space-x-2', className)}>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button variant='ghost' size='sm' className='-ml-3 h-8 data-[state=open]:bg-accent'>
						<span>{title}</span>
						{column.getIsSorted() === 'desc' ? (
							<ArrowDownIcon className='ml-2 h-4 w-4' />
						) : column.getIsSorted() === 'asc' ? (
							<ArrowUpIcon className='ml-2 h-4 w-4' />
						) : null}
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align='start'>
					<DropdownMenuItem onClick={() => column.toggleSorting(false)}>
						<ArrowUpIcon className='text-muted-foreground/70' />
						<span>Asc</span>
					</DropdownMenuItem>
					<DropdownMenuItem onClick={() => column.toggleSorting(true)}>
						<ArrowDownIcon className='text-muted-foreground/70' />
						<span>Desc</span>
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	)
}
