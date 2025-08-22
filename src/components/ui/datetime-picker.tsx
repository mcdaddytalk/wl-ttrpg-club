"use client";

import {
  CalendarCheck,
  CalendarClock,
  CalendarCog,
  Clock,
} from "lucide-react";
import React, { useRef } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar"; // ⬅️ use your wrapper
import { format } from "date-fns";
import { TimePickerInput } from "@/components/TimePicker";

export type DatetimePickerProps = Omit<
  React.ComponentProps<typeof Calendar>,
  "mode" | "selected" | "onSelect"
> & {
  /** The currently selected full Date (date + time). */
  selected?: Date;
  /** Update function that receives a full Date (date + time). */
  setDate: (date: Date) => void;
  /** Optional bounds for the calendar dropdowns. */
  startMonth?: Date;
  endMonth?: Date;
};

const DatetimePicker = ({
  className,
  classNames,
  showOutsideDays = true,
  selected,
  setDate: setGlobalDate,
  startMonth = new Date(1900, 0), // Jan 1900 (new API replaces fromYear)
  endMonth = new Date(new Date().getFullYear(), 11), // Dec current year
  ...props
}: DatetimePickerProps) => {
  const minuteRef = useRef<HTMLInputElement>(null);
  const hourRef = useRef<HTMLInputElement>(null);

  const base = selected ?? new Date();

  // Merge Y/M/D from a picked date into the existing selected Date (preserve time)
  const setDate = (picked: Date | undefined) => {
    if (!picked) return;
    const next = new Date(selected ?? picked);
    next.setFullYear(picked.getFullYear());
    next.setMonth(picked.getMonth());
    next.setDate(picked.getDate());
    setGlobalDate(next);
  };

  // Merge H:M from time inputs into the existing selected Date (preserve date)
  const setTime = (timeInput: Date | undefined) => {
    if (!timeInput) return;
    const next = new Date(selected ?? new Date());
    next.setHours(timeInput.getHours());
    next.setMinutes(timeInput.getMinutes());
    next.setSeconds(0);
    next.setMilliseconds(0);
    setGlobalDate(next);
  };

  const disabledMatchers = [
    { before: new Date(startMonth.getFullYear(), startMonth.getMonth(), 1) },
    { after:  new Date(endMonth.getFullYear(),   endMonth.getMonth() + 1, 0) },
  ];

  return (
    <div className="datetime-picker">
      <div className="daypicker-wrapper">
        <Calendar
          mode="single"
          selected={selected ?? undefined}
          onSelect={setDate}
          showOutsideDays={showOutsideDays}
          className={cn("py-3", className)}
          // Fast month/year selection + non-deprecated bounds
          captionLayout="dropdown"
          startMonth={startMonth}
          endMonth={endMonth}
          disabled={disabledMatchers}
          // Optional: keep your wrapper styling knobs; pass-through extra props
          {...props}
        />
      </div>

      <div className="daypicker-footer">
        <hr className="mt-2" />
        <div className="mt-2 -ml-2 -mr-2">
          <div>
            <Button
              variant="ghost"
              className="w-full justify-between text-gray-700"
              onClick={() => setDate(new Date())}
            >
              <div className="flex">
                <CalendarCheck className="h-5 w-5 mr-2" />
                Today
              </div>
              <p className="text-sm text-gray-400 font-normal">
                {format(new Date(), "PPP")}
              </p>
            </Button>
          </div>

          <div>
            <Button
              variant="ghost"
              className="w-full justify-between text-gray-700"
              onClick={() => {
                const d = new Date();
                d.setDate(d.getDate() + 1);
                setDate(d);
              }}
            >
              <div className="flex">
                <CalendarCog className="h-5 w-5 mr-2" />
                Tomorrow
              </div>
              <p className="text-sm text-gray-400 font-normal">
                {format(new Date(Date.now() + 24 * 60 * 60 * 1000), "PPP")}
              </p>
            </Button>
          </div>

          <div>
            <Button
              variant="ghost"
              className="w-full justify-between text-gray-700"
              onClick={() => {
                const d = new Date();
                d.setDate(d.getDate() + 7);
                setDate(d);
              }}
            >
              <div className="flex">
                <CalendarClock className="h-5 w-5 mr-2" />
                Next week
              </div>
              <p className="text-sm text-gray-400 font-normal">
                {format(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), "PPP")}
              </p>
            </Button>
          </div>
        </div>

        <div className="px-2 mt-4 flex justify-between">
          <div className="flex gap-2 items-center text-gray-700">
            <Clock className="h-5 w-5" />
            <p className="text-sm font-medium">Time</p>
          </div>
          <div className="font-medium">
            <div className="flex items-center gap-2">
              <TimePickerInput
                picker="hours"
                date={base}
                setDate={setTime}
                ref={hourRef}
                onRightFocus={() => minuteRef.current?.focus()}
              />
              <span>:</span>
              <TimePickerInput
                picker="minutes"
                date={base}
                setDate={setTime}
                ref={minuteRef}
                onLeftFocus={() => hourRef.current?.focus()}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DatetimePicker;
