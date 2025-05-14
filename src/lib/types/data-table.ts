import { type DataTableConfig } from "@/config/data-table";
import { type z } from "zod";
import { type filterSchema } from "@/lib/parsers";
import { ColumnSort } from "@tanstack/react-table";

/* DataTable Support Types */
export type ColumnType = DataTableConfig["columnTypes"][number]
export type FilterOperator = DataTableConfig["globalOperators"][number]
export interface SearchParams {
  [key: string]: string | string[] | undefined
}
export type Prettify<T> = {
  [K in keyof T]: T[K]
} & {}
export type StringKeyOf<T> = Extract<keyof T, string>
export interface Option {
  label: string
  value: string
  icon?: React.ComponentType<{ className?: string }>
  count?: number
}
export type Filter<TData> = Prettify<
  Omit<z.infer<typeof filterSchema>, "id"> & {
    id: StringKeyOf<TData>
  }
>
export interface DataTableFilterField<TData> {
  id: StringKeyOf<TData>
  label: string
  placeholder?: string
  options?: Option[]
}
export interface ExtendedColumnSort<TData> extends Omit<ColumnSort, "id"> {
  id: StringKeyOf<TData>
}
export type ExtendedSortingState<TData> = ExtendedColumnSort<TData>[]
export type JoinOperator = DataTableConfig["joinOperators"][number]["value"]
