'use client'

import {
  parseAsStringEnum,
  useQueryState,
} from "nuqs"

const parseAsStringOrNull = {
    parse(value: string | string[] | undefined) {
      if (!value || value === "") return null
      return typeof value === "string" ? value : value[0]
    },
    serialize(value: string | null) {
      return value ?? ""
    },
  }

export function useMessageFilters() {
  const [read, setRead] = useQueryState(
    "read",
    parseAsStringEnum(["read", "unread", "all"]).withDefault("all")
  )

  const [category, setCategory] = useQueryState("category", parseAsStringOrNull)
  const [sender_id, setSenderId] = useQueryState("sender_id", parseAsStringOrNull)

  return {
    filters: {
      read,
      category,
      sender_id,
    },
    setters: {
      setRead,
      setCategory,
      setSenderId,
    },
  }
}
