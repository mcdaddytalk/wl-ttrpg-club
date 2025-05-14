'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect } from "react"
import { toast } from "sonner"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { GMGameScheduleSchema, ScheduleUpdateInput } from "@/lib/validation/gameSchedules"
import { GMGameScheduleDO, GMLocationDO } from "@/lib/types/data-objects"
import { GAME_INTERVALS } from "@/lib/types/custom"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { LocationTypeBadge } from "@/components/LocationTypeBadge"
import logger from "@/utils/logger"
import { fromDatetimeLocal, toDatetimeLocal } from "@/utils/helpers"

interface Props {
  open: boolean
  onClose: () => void
  onUpdate: (values: ScheduleUpdateInput) => void
  schedule?: GMGameScheduleDO
  locations: GMLocationDO[]
}

export function GMScheduleEditModal({ open, onClose, onUpdate, schedule, locations }: Props) {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<ScheduleUpdateInput>({
    resolver: zodResolver(GMGameScheduleSchema),
    defaultValues: {
        next_game_date: "",
        interval: "weekly",
        location_id: "",
    },
  })

  useEffect(() => {
    if (schedule) {
      reset({
        next_game_date: toDatetimeLocal(schedule?.next_game_date),
        interval: schedule.interval as ScheduleUpdateInput["interval"],
        location_id: schedule.location?.id ?? "",
      })
    }
  }, [schedule, reset])

  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      logger.warn("Form validation errors", errors)
    }
  }, [errors])

  const submitHandler = (values: ScheduleUpdateInput) => {
    try {
        const patched = {
          ...values,
          next_game_date: fromDatetimeLocal(values.next_game_date ?? ""),
        }
        logger.info("Patched schedule", patched)
        onUpdate(patched)
        toast.success("Schedule updated")
        onClose()
      } catch (e) {
        logger.error("Submit handler failed:", e)
      }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Schedule</DialogTitle>
          <DialogDescription>Edit the schedule for this game</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(submitHandler)} className="space-y-4">
          <div>
            <Label htmlFor="next_game_date">Next Game Date</Label>
            <Input type="datetime-local" {...register("next_game_date")} step="60"/>
            {errors.next_game_date && <p className="text-sm text-red-600">{errors.next_game_date.message}</p>}
          </div>

          <div>
            <Label htmlFor="interval">Interval</Label>
            <Controller
                name="interval"
                control={control}
                render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                        <SelectValue placeholder="Select Interval" />
                    </SelectTrigger>
                    <SelectContent>
                        {GAME_INTERVALS.map((interval) => (
                        <SelectItem key={interval} value={interval}>{interval}</SelectItem>
                        ))}
                    </SelectContent>
                    </Select>
                )}
            />
            {errors.interval && <p className="text-sm text-red-600">{errors.interval.message}</p>}
          </div>

          <div>
            <Label htmlFor="location_id">Location</Label>
            <Controller
                name="location_id"
                control={control}
                render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                        <SelectValue placeholder="Select Location" />
                    </SelectTrigger>
                    <SelectContent>
                        {locations.map((loc) => {
                        const isDisabled = loc.scope === "disabled"
                        const tooltipText = loc.url || loc.address || "No additional info"

                        return (
                            <Tooltip key={loc.id}>
                            <TooltipTrigger asChild>
                                <SelectItem
                                value={loc.id}
                                disabled={isDisabled}
                                className={isDisabled ? "opacity-50 cursor-not-allowed" : ""}
                                >
                                <div className="flex justify-between items-center w-full">
                                    <div className="flex flex-col">
                                    <span className="truncate font-medium">{loc.name}</span>
                                    {isDisabled && (
                                        <span className="text-xs text-muted-foreground italic">Inactive</span>
                                    )}
                                    </div>
                                    <LocationTypeBadge type={loc.type} />
                                </div>
                                </SelectItem>
                            </TooltipTrigger>
                            <TooltipContent className="max-w-xs text-sm text-muted-foreground">
                                {tooltipText}
                            </TooltipContent>
                            </Tooltip>
                        )
                        })}
                    </SelectContent>
                </Select>
            )}
            />
            {errors.location_id && <p className="text-sm text-red-600">{errors.location_id.message}</p>}
          </div>

          <DialogFooter>
            <Button type="submit">Save</Button>
            <Button onClick={onClose}>Cancel</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
