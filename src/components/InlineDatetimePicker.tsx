'use client';

import { formatDate } from '@/utils/helpers';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { TimePickerInput } from '@/components/TimePicker';
import { cn } from '@/lib/utils';
import { useRef } from 'react';

interface InlineDatetimePickerProps {
  value?: string | null;
  onChange: (newISO: string) => void;
  disabled?: boolean;
}

export function InlineDatetimePicker({ value, onChange, disabled }: InlineDatetimePickerProps) {
  const hourRef = useRef<HTMLInputElement>(null);
  const minuteRef = useRef<HTMLInputElement>(null);
  const current = value ? new Date(value) : new Date();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            'w-full pl-3 text-left font-normal',
            !value && 'text-muted-foreground'
          )}
          disabled={disabled}
        >
          {value
            ? formatDate(current, {
                formatStr: 'MMM D, YYYY h:mm A'
              })
            : 'Pick a date and time'}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-4 space-y-2">
        <Calendar
          mode="single"
          selected={current}
          onSelect={(date) => {
            if (!date) return;
            const updated = new Date(current);
            updated.setFullYear(date.getFullYear());
            updated.setMonth(date.getMonth());
            updated.setDate(date.getDate());
            onChange(updated.toISOString());
          }}
          initialFocus
        />
        <div className="flex justify-between gap-2">
          <TimePickerInput
            picker="hours"
            date={current}
            setDate={(d) => {
              if (!d) return;
              const updated = new Date(current);
              updated.setHours(d.getHours());
              onChange(updated.toISOString());
            }}
            ref={hourRef}
            onRightFocus={() => minuteRef.current?.focus()}
          />
          <span>:</span>
          <TimePickerInput
            picker="minutes"
            date={current}
            setDate={(d) => {
              if (!d) return;
              const updated = new Date(current);
              updated.setMinutes(d.getMinutes());
              onChange(updated.toISOString());
            }}
            ref={minuteRef}
            onLeftFocus={() => hourRef.current?.focus()}
          />
        </div>
      </PopoverContent>
    </Popover>
  );
}