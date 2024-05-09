'use client'

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { cn } from '@/lib/utils'
import {
	ColumnDef,
	ColumnMeta,
	Row,
	SortingState,
	TableState,
	flexRender,
	getCoreRowModel,
	getSortedRowModel,
	useReactTable,
} from '@tanstack/react-table'
import { useState } from 'react'

interface DataTableProps<TData, TValue> {
	columns: ColumnDef<TData, TValue>[]
	data: TData[]
	defaultState?: Partial<{ sorting: TableState['sorting'] }>
}

export function DataTable<TData, TValue>({ columns, data, defaultState }: DataTableProps<TData, TValue>) {
	function getCellClassNames(columnMeta: ColumnMeta<TData, unknown> | undefined, row: Row<TData>) {
		if (typeof (columnMeta as any)?.cellClassName === 'function') return (columnMeta as any)?.cellClassName(row.original)
		return (columnMeta as any)?.cellClassName
	}

	const [sorting, setSorting] = useState<SortingState>(defaultState?.sorting ?? [])

	const table = useReactTable({
		data,
		columns,
		state: { sorting },
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel(),
		onSortingChange: setSorting,
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
										getCellClassNames(cell.column.columnDef.meta, row)
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
