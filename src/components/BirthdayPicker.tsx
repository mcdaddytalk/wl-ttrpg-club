"use client";

import * as React from "react";
import dayjs from "dayjs";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar"; // your wrapper around react-day-picker v9.9.0
import { CalendarIcon } from "lucide-react";

type BirthdayPickerProps = {
  /** "YYYY-MM-DD" or null */
  value?: string | null;
  /** Receives "YYYY-MM-DD" or null */
  onChange: (value: string | null) => void;
  className?: string;

  /**
   * Bounds for the calendar dropdowns (inclusive).
   * Use the new props below to avoid deprecation warnings.
   */
  startMonth?: Date; // e.g., new Date(1900, 0)
  endMonth?: Date;   // e.g., new Date(new Date().getFullYear(), 11)

  /**
   * @deprecated Prefer startMonth/endMonth. Kept for convenience; we translate to months internally.
   */
  fromYear?: number;
  /** @deprecated Prefer startMonth/endMonth. */
  toYear?: number;

  placeholder?: string;

  /** Optional: initial month/year when empty (e.g., 1990 opens Jan 1990) */
  emptyDefaultYear?: number;
};

export function BirthdayPicker({
  value,
  onChange,
  className,
  startMonth,
  endMonth,
  // TDODO remove deprecations by end of year
  // deprecated aliases (still work if you pass them)
  fromYear,
  toYear,
  placeholder = "YYYY-MM-DD",
  emptyDefaultYear,
}: BirthdayPickerProps) {
  const [open, setOpen] = React.useState(false);
  const [text, setText] = React.useState(value ?? "");

  React.useEffect(() => {
    setText(value ?? "");
  }, [value]);

  const today = new Date();

  // Compute month bounds, preferring new props; fall back to year aliases if provided; finally sensible defaults.
  const computedFromMonth =
    startMonth ??
    (typeof fromYear === "number" ? new Date(fromYear, 0) : new Date(1900, 0));
  const computedToMonth =
    endMonth ??
    (typeof toYear === "number"
      ? new Date(toYear, 11)
      : new Date(new Date().getFullYear(), 11));

  const selectedDate = value ? dayjs(value, "YYYY-MM-DD", true).toDate() : undefined;

  const commitString = (s: string) => {
    const trimmed = s.trim();
    if (!trimmed) return onChange(null);

    // strict YYYY-MM-DD
    const parsed = dayjs(trimmed, "YYYY-MM-DD", true);
    if (!parsed.isValid()) return;           // let RHF/Zod surface error state
    const asDate = parsed.toDate();
    if (asDate > today) return;              // disallow future birthdays

    // Respect bounds
    if (asDate < startOfMonth(computedFromMonth) || asDate > endOfMonth(computedToMonth)) {
      return;
    }

    onChange(parsed.format("YYYY-MM-DD"));
  };

  const defaultMonth =
    selectedDate ??
    (typeof emptyDefaultYear === "number"
      ? new Date(Math.min(emptyDefaultYear, computedToMonth.getFullYear()), 0, 1)
      : new Date(Math.min(computedToMonth.getFullYear() - 30, computedToMonth.getFullYear()), 0, 1));

  return (
    <div className={cn("flex items-center gap-2", className)}>
      {/* Text input (typing works everywhere) */}
      <Input
        value={text}
        onChange={(e) => setText(e.target.value)}
        onBlur={() => commitString(text)}
        autoComplete="bday"
        inputMode="numeric"
        pattern="\d{4}-\d{2}-\d{2}"
        placeholder={placeholder}
        aria-label="Birthday"
      />

      {/* Calendar Popover (with fast year/month dropdowns) */}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" type="button" aria-label="Open date picker" className="shrink-0">
            <CalendarIcon className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto overflow-hidden p-0" side="bottom" align="start">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={(d) => {
              if (!d) return;
              const iso = dayjs(d).format("YYYY-MM-DD");
              setText(iso);
              onChange(iso);
              setOpen(false);
            }}
            captionLayout="dropdown"
            startMonth={computedFromMonth}   // ✅ new API (no deprecation warnings)
            endMonth={computedToMonth}       // ✅ new API (no deprecation warnings)
            disabled={(d) => d > today}
            defaultMonth={selectedDate ?? defaultMonth}
            showOutsideDays={false}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}

/** Helpers */
function startOfMonth(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}
function endOfMonth(d: Date) {
  return new Date(d.getFullYear(), d.getMonth() + 1, 0);
}
