"use client"

import * as React from "react"
import type { DataTableFilterField } from "@/lib/types/data-table"
import type { Table } from "@tanstack/react-table"
import { X, Search } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DataTableFacetedFilter } from "@/components/DataTable/data-table-faceted-filter"
import { DataTableViewOptions } from "@/components/DataTable/data-table-view-options"

interface DataTableToolbarProps<TData>
  extends React.HTMLAttributes<HTMLDivElement> {
  table: Table<TData>
  /**
   * An array of filter field configurations for the data table.
   * When options are provided, a faceted filter is rendered.
   * Otherwise, a search filter is rendered.
   *
   * @example
   * const filterFields = [
   *   {
   *     id: 'name',
   *     label: 'Name',
   *     placeholder: 'Filter by name...'
   *   },
   *   {
   *     id: 'status',
   *     label: 'Status',
   *     options: [
   *       { label: 'Active', value: 'active', icon: ActiveIcon, count: 10 },
   *       { label: 'Inactive', value: 'inactive', icon: InactiveIcon, count: 5 }
   *     ]
   *   }
   * ]
   */
  filterFields?: DataTableFilterField<TData>[],
  globalFilter?: string;
  setGlobalFilter?: (value: string) => void; 
}

export function DataTableToolbar<TData>({
  table,
  filterFields = [],
  globalFilter,
  setGlobalFilter,
  children,
  className,
  ...props
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0
  
  // Memoize computation of searchableColumns and filterableColumns
  const { searchableColumns, filterableColumns } = React.useMemo(() => {
    return {
      searchableColumns: filterFields.filter((field) => !field.options),
      filterableColumns: filterFields.filter((field) => field.options),
    }
  }, [filterFields])

  return (
    <div
      className={cn(
        "flex w-full items-center justify-between gap-2 overflow-auto p-1",
        className
      )}
      {...props}
    >
      <div className="flex flex-1 items-center gap-2">
        {globalFilter !== undefined && setGlobalFilter && (
          <div className="relative flex-1 max-w-sm">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
              <Search className="h-4 w-4" />
            </span>
            <Input
              placeholder="Global Search..."
              value={globalFilter}
              onChange={(e) => {
                const value = e.target.value;
                setGlobalFilter(value);
        
                // If cleared (blank string), reset table filters
                if (value.trim() === "") {
                  table.resetGlobalFilter();
                }
              }}
              className="pl-9 h-8"
            />
          </div>
        )}
        {searchableColumns.length > 0 &&
          searchableColumns.map(
            (column) =>
              table.getColumn(column.id ? String(column.id) : "") && (
                <Input
                  key={String(column.id)}
                  placeholder={column.placeholder}
                  value={
                    (table
                      .getColumn(String(column.id))
                      ?.getFilterValue() as string) ?? ""
                  }
                  onChange={(event) =>
                    table
                      .getColumn(String(column.id))
                      ?.setFilterValue(event.target.value)
                  }
                  className="h-8 w-40 lg:w-64"
                />
              )
          )}
        {filterableColumns.length > 0 &&
          filterableColumns.map(
            (column) =>
              table.getColumn(column.id ? String(column.id) : "") && (
                <DataTableFacetedFilter
                  key={String(column.id)}
                  column={table.getColumn(column.id ? String(column.id) : "")}
                  title={column.label}
                  options={column.options ?? []}
                />
              )
          )}
        {isFiltered && (
          <Button
            aria-label="Reset filters"
            variant="ghost"
            className="h-8 px-2 lg:px-3"
            onClick={() => table.resetColumnFilters()}
          >
            Reset
            <X className="ml-2 size-4" aria-hidden="true" />
          </Button>
        )}
      </div>
      <div className="flex items-center gap-2">
        {children}
        <DataTableViewOptions table={table} />
      </div>
    </div>
  )
}