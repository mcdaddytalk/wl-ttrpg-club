"use client"

import { DataTable } from "@/components/DataTable/data-table"
import { DataTableToolbar } from "@/components/DataTable/data-table-toolbar"
import { useDataTable } from "@/hooks/use-data-table"
import { GMGameScheduleDO } from "@/lib/types/data-objects"
import { DataTableFilterField } from "@/lib/types/data-table"
import { getColumns } from "./columns"
import { useMemo, useState } from "react"
import { useFetchAllGameSchedules, useUpdateGameSchedule } from "@/hooks/gamemaster/useGamemasterGameSchedules"
import { ScheduleUpdateInput } from "@/lib/validation/gameSchedules"
import { GMScheduleEditModal } from "./GMScheduleEditModal"
import { useGamemasterLocations } from "@/hooks/gamemaster/useGamemasterLocations"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import logger from "@/utils/logger"
import { useGMScheduleFilters } from "@/hooks/filters/useGMScheduleFilters"

interface GMScheduleTableProps {
    className?: string
}

export const GMScheduleTable = ({ className }: GMScheduleTableProps): React.ReactElement => {
    const [editingSchedule, setEditingSchedule] = useState<GMGameScheduleDO | null>(null)
    const { filters } = useGMScheduleFilters()
    const { interval, status, dayOfWeek} = filters;

    const { data: schedules } = useFetchAllGameSchedules()
    const { locations } = useGamemasterLocations()
    const updateSchedule = useUpdateGameSchedule(editingSchedule?.game_id ?? "")

    const [activeModal, setActiveModal] = useState<string | null>(null);
    // const [isAddScheduleModalOpen, setAddScheduleModalOpen] = useState(false);
    const [isEditScheduleModalOpen, setEditLocationModalOpen] = useState(false);
    // const [isRemoveScheduleModalOpen, setRemoveLocationModalOpen] = useState(false);

    const openModal = (modal: string, schedule?: GMGameScheduleDO) => {
        logger.info("Opening modal", modal)
        logger.info("Schedule", schedule)    
        if (schedule) setEditingSchedule(schedule);
        logger.info("Editing schedule", editingSchedule)
        // if (modal === 'addSchedule') setAddScheduleModalOpen(true);
        if (modal === 'editSchedule') setEditLocationModalOpen(true);
        // if (modal === 'removeSchedule') setRemoveLocationModalOpen(true);
        setActiveModal(modal);
    }

    const closeModal = () => {
        // if (activeModal === 'addSchedule') setAddScheduleModalOpen(false);
        if (activeModal === 'editSchedule') setEditLocationModalOpen(false);
        // if (activeModal === 'removeSchedule') setRemoveLocationModalOpen(false);
        setActiveModal(null);
    }
    
    const handleScheduleUpdate = async (values: ScheduleUpdateInput) => {
        logger.info("Updating schedule", values)
        if (!editingSchedule) return
        await updateSchedule.mutateAsync({ ...values })
        closeModal()        
    }

    const filterFields: DataTableFilterField<GMGameScheduleDO>[] = [
        {
            id: "schedule_status",
            label: "Schedule Status",
            options: [
              { label: "All", value: "" },
              { label: "Draft", value: "draft" },
              { label: "Active", value: "active" },
              { label: "Cancelled", value: "cancelled" },
            ],
          },
          {
            id: "interval",
            label: "Interval",
            options: [
              { label: "All", value: "" },
              { label: "Weekly", value: "weekly" },
              { label: "Biweekly", value: "biweekly" },
              { label: "Monthly", value: "monthly" },
            ],
          },
    ]

    const filteredSchedules = useMemo(() => {
        return (schedules ?? []).filter((sched) => {
          if (interval && sched.interval !== interval) return false
          if (status && sched.schedule_status !== status) return false
          if (dayOfWeek && sched.day_of_week !== dayOfWeek) return false
          return true
        })
      }, [schedules, interval, status, dayOfWeek])

    const { table, globalFilter, setGlobalFilter } = useDataTable<GMGameScheduleDO>({
        data: filteredSchedules ?? [],
        columns: getColumns({ onOpenModal: openModal }),
        pageCount: 1,
        filterFields,
        initialState: {
          pagination: { pageIndex: 0, pageSize: 5 },
        },
        getRowId: (row) => row.game_id,
        shallow: false,
        clearOnDefault: true,
    })

    return (
        <section>
            <Card className={className}>
                <CardHeader>
                    <CardTitle className="text-xl font-bold">GM Game Schedules</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex justify-between items-center mb-4">
                        <Button
                            className="bg-green-400 hover:bg-green-600 text-slate-700 rounded-md px-4 py-2"
                            onClick={() => openModal("addSchedule")}
                        >
                            Add Schedule
                        </Button>
                    </div>
                    { filteredSchedules && filteredSchedules.length  > 0 
                    ? (
                        <DataTable table={table} >
                            <DataTableToolbar 
                                table={table} 
                                filterFields={filterFields}
                                globalFilter={globalFilter}
                                setGlobalFilter={setGlobalFilter}
                            />
                            
                        </DataTable>
                    )
                    : (
                        <div className="text-center p-4">
                            <span className="text-gray-500">No Schedules found.</span>
                            <br />
                            <span className="text-gray-500">Click the &ldquo;Add Schedule&rdquo; button to create a new schedule.</span>
                        </div>
                    )}
                </CardContent>
                {activeModal === 'editSchedule' && (
                    <GMScheduleEditModal
                        open={isEditScheduleModalOpen}
                        onClose={closeModal}
                        onUpdate={handleScheduleUpdate}
                        schedule={editingSchedule ?? undefined}
                        locations={locations}
                    />
                )}
            </Card>
        </section>
        
    )
}