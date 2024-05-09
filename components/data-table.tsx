'use client'

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { cn } from '@/lib/utils'
import { ColumnDef, TableState, flexRender, getCoreRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table'

interface DataTableProps<TData, TValue> {
	columns: ColumnDef<TData, TValue>[]
	data: TData[]
	defaultState?: Partial<TableState>
}

export function DataTable<TData, TValue>({ columns, data, defaultState }: DataTableProps<TData, TValue>) {
	const table = useReactTable({
		data,
		columns,
		state: defaultState,
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel(),
	})

	return (
		<Table>
			<TableHeader>
				{table.getHeaderGroups().map((headerGroup) => (
					<TableRow key={headerGroup.id}>
						{headerGroup.headers.map((header) => {
							return (
								<TableHead
									key={header.id}
									className={cn(
										(header.column.columnDef.meta as any)?.className,
										(header.column.columnDef.meta as any)?.headerClassName
									)}>
									{header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
								</TableHead>
							)
						})}
					</TableRow>
				))}
			</TableHeader>
			<TableBody>
				{table.getRowModel().rows?.length ? (
					table.getRowModel().rows.map((row) => (
						<TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
							{row.getVisibleCells().map((cell) => (
								<TableCell
									key={cell.id}
									className={cn(
										(cell.column.columnDef.meta as any)?.className,
										(cell.column.columnDef.meta as any)?.cellClassName
									)}>
									{flexRender(cell.column.columnDef.cell, cell.getContext())}
								</TableCell>
							))}
						</TableRow>
					))
				) : (
					<TableRow>
						<TableCell colSpan={columns.length} className='h-24 text-center'>
							No results.
						</TableCell>
					</TableRow>
				)}
			</TableBody>
		</Table>
	)
}
