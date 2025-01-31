import { DataTableSkeleton } from "@/components/DataTable/data-table-skeleton";
import { Shell } from "@/components/Shell";
import React, { Suspense } from "react";
import GMLocationsTable from "../_components/GMLocationsTable/GMLocationsTable";



export default function GMLocationsDashboard(): React.ReactElement {
    return (
        <Shell className="gap-2">
            <Suspense fallback={
                <DataTableSkeleton 
                    columnCount={6}
                    rowCount={6}
                    searchableColumnCount={2}
                    filterableColumnCount={2}
                    withPagination={false}
                    cellWidths={["10rem", "40rem", "12rem", "12rem", "8rem", "8rem"]}
                    shrinkZero
                />
            }>
                <GMLocationsTable />
            </Suspense>
        </Shell>
    )
}