"use client"

import React, { useState } from 'react';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  useReactTable,
  SortingState,
  PaginationState
} from '@tanstack/react-table';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}
export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
    const [sorting, setSorting] = useState<SortingState>([]);
    const [rowSelection, setRowSelection] = useState({});
    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 8, // Limit to 4 rows per page
    });
    
    const table = useReactTable({
        data,
        columns,
        state: {
            sorting,
            rowSelection,
            pagination
        },
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(), // Enable sorting
        getPaginationRowModel: getPaginationRowModel(),
        onRowSelectionChange: setRowSelection,
        onSortingChange: setSorting,
        onPaginationChange: setPagination,
    })

    const emptyRowsCount = pagination.pageSize - table.getRowModel().rows.length;

    return (
        <div className='rounded-md border bg-card text-card-foreground'>
        <Table>
            <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                    return (
                    <TableHead key={header.id}>
                        {header.isPlaceholder
                        ? null
                        : <div
                                onClick={header.column.getToggleSortingHandler()}
                                className="cursor-pointer"
                            >
                            {flexRender(header.column.columnDef.header, header.getContext())}
                            {header.column.getIsSorted() === 'asc' && ' 🔼'}
                            {header.column.getIsSorted() === 'desc' && ' 🔽'}
                            </div>}
                    </TableHead>
                    );
                })}
                </TableRow>
            ))}
            </TableHeader>
            <TableBody>
            {table.getRowModel().rows.map((row, rowIndex) => (
                <TableRow 
                key={row.id}
                data-state={row.getIsSelected() && 'selected'}
                className={rowIndex % 2 === 0 
                    ? 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-100' 
                    : 'bg-white dark:bg-slate-500 text-slate-500 dark:text-slate-300'}
                >
                {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                ))}
                </TableRow>
            ))}
            {/* Fill empty rows to maintain table height */}
            {Array.from({ length: emptyRowsCount }).map((_, index) => (
                <TableRow key={`empty-${index}`} className="bg-white">
                {columns.map((column, colIndex) => (
                    <TableCell key={`empty-cell-${colIndex}`}>
                    <Skeleton className="h-8 w-full" />
                    </TableCell>
                ))}
                </TableRow>
            ))}
            </TableBody>
        </Table>
        {/* Pagination Controls */}
        <div className="flex justify-between items-center mt-1 border-t py-1">
            <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            >
            Previous
            </Button>
            <span>
                Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
            </span>
            <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            >
            Next
            </Button>
        </div>
        </div>
    );
};
