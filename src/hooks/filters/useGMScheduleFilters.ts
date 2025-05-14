'use client'

import { useQueryState, parseAsStringEnum } from "nuqs"

export function useGMScheduleFilters() {
  const [status, setStatus] = useQueryState(
    "status",
    parseAsStringEnum(["draft", "active", "cancelled"]).withDefault("active")
  )

  const [interval, setInterval] = useQueryState(
    "interval",
    parseAsStringEnum(["weekly", "biweekly", "monthly"]).withDefault("weekly")
  )

  const [dayOfWeek, setDayOfWeek] = useQueryState(
    "dayOfWeek",
    parseAsStringEnum(["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"]).withDefault("sunday")
  )

  return {
    filters: {
      status,
      interval,
      dayOfWeek,
    },
    setters: {
      setStatus,
      setInterval,
      setDayOfWeek,
    },
  }
}
