'use client'

import React from 'react'
import * as chrono from 'chrono-node'
import { Calendar as CalendarIcon } from 'lucide-react'

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import { Input } from '@/components/ui/input'
import { Button, buttonVariants } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import localizedFormat from 'dayjs/plugin/localizedFormat'
import { enUS as enUSLocale, type Locale } from 'date-fns/locale'

dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.extend(localizedFormat)

/* -------------------------------------------------------------------------- */
/*                               Inspired By:                                 */
/*                               @steventey                                   */
/* ------------------https://dub.co/blog/smart-datetime-picker--------------- */
/* -------------------------------------------------------------------------- */

const chronoLocales = ['en','de','fr','ja','pt','nl','zh','ru','es','uk'] as const
type ChronoLocale = (typeof chronoLocales)[number]

export const parseDateTime = (str: Date | string, locale: Locale): Date | null => {
  if (str instanceof Date) return str
  const code = (locale.code || 'en').split('-')[0] as ChronoLocale
  const chosen = (chronoLocales.includes(code) ? code : 'en') as ChronoLocale
  const chronoDate = chrono[chosen].parseDate(str)
  return chronoDate ?? null
}

export const getDateTimeLocal = (timestamp?: Date): string => {
  const d = dayjs(timestamp).local()
  return d.isValid() ? d.format('YYYY-MM-DDTHH:mm') : ''
}

export const formatDateTime = (
  datetime: Date | string,
  locale: Locale,
): string => {
  const fmt = 'MMM D, YYYY HH:mm' // 24h
  const d = dayjs(datetime).locale((locale.code || 'en').split('-')[0])
  return d.isValid() ? d.format(fmt) : ''
}

export const extractHourMinute = (date: Date): { hour: number, minute: number } => {
  const d = dayjs(date)
  return { hour: d.hour(), minute: d.minute() }
}

export const setDateWithTime = (date: Date, hour: number, minute: number): Date => {
  return dayjs(date).hour(hour).minute(minute).second(0).millisecond(0).toDate()
}

const inputBase =
  'bg-transparent focus:outline-none focus:ring-0 focus-within:outline-none focus-within:ring-0 sm:text-sm disabled:cursor-not-allowed disabled:opacity-50'

const DEFAULT_SIZE = 96

type CalendarPassThrough = Pick<
  React.ComponentProps<typeof Calendar>,
  | 'startMonth'
  | 'endMonth'
  | 'captionLayout'
  | 'showOutsideDays'
  | 'defaultMonth'
  | 'numberOfMonths'
  | 'weekStartsOn'
>

type SmartDatetimeInputProps = CalendarPassThrough & {
  value?: Date | null
  locale?: Locale
  onValueChange: (date: Date | null) => void
  className?: string
  placeholder?: string
  disabled?: boolean
}

type SmartDatetimeInputContextProps = SmartDatetimeInputProps & {
  Time: string                // "HH:mm"
  onTimeChange: (time: string) => void
}

const SmartDatetimeInputContext =
  React.createContext<SmartDatetimeInputContextProps | null>(null)

const useSmartDateInput = () => {
  const context = React.useContext(SmartDatetimeInputContext)
  if (!context) {
    throw new Error('useSmartDateInput must be used within SmartDateInputProvider')
  }
  return context
}

export const SmartDatetimeInput = React.forwardRef<
  HTMLInputElement,
  Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    'type' | 'ref' | 'value' | 'defaultValue' | 'onBlur' | 'disabled'
  > & SmartDatetimeInputProps
>(
  (
    {
      className,
      value,
      locale = enUSLocale,
      onValueChange,
      placeholder,
      disabled,
      startMonth = new Date(1900, 0),
      endMonth = new Date(new Date().getFullYear(), 11),
      captionLayout = 'dropdown',       // 🔽 fast Y/M selection
      showOutsideDays = true,
      defaultMonth,
      numberOfMonths,
      weekStartsOn,
      ...dateTimeInputProps
    },
    ref,
  ) => {
    const [Time, setTime] = React.useState<string>('') // "HH:mm"

    const onTimeChange = React.useCallback((time: string) => {
      setTime(time)
    }, [])

    return (
      <SmartDatetimeInputContext.Provider
        value={{
          value,
          onValueChange,
          Time,
          onTimeChange,
          startMonth,
          endMonth,
          captionLayout,
          showOutsideDays,
          defaultMonth,
          numberOfMonths,
          weekStartsOn,
          className,
          placeholder,
          disabled,
          ...dateTimeInputProps,
        }}
      >
        <div className="flex items-center justify-center">
          <div
            className={cn(
              'flex gap-1 w-full p-1 items-center justify-between rounded-md border transition-all',
              'focus-within:outline-0 focus:outline-0 focus:ring-0',
              'placeholder:text-muted-foreground focus-visible:outline-0 ',
              className,
            )}
          >
            <DateTimeLocalInput
              locale={locale}
              disabled={typeof disabled === 'boolean' ? disabled : undefined}
            />
            <NaturalLanguageInput
              ref={ref}
              locale={locale}
              placeholder={placeholder}
              disabled={typeof disabled === 'boolean' ? disabled : undefined}
            />
          </div>
        </div>
      </SmartDatetimeInputContext.Provider>
    )
  },
)

SmartDatetimeInput.displayName = 'DatetimeInput'

/* ------------------------------- Time Picker ------------------------------ */

type TimePickerProps = { locale: Locale }

const TimePicker = ({ locale }: TimePickerProps) => {
  const { value, onValueChange, Time, onTimeChange } = useSmartDateInput()
  const [activeIndex, setActiveIndex] = React.useState(-1)
  const step = 15 // minutes

  const formatSelectedTime = React.useCallback(
    (display: string, hour: number, partIndex: number) => {
      onTimeChange(display)                             // "HH:mm"
      const base = parseDateTime(value ?? new Date(), locale)
      if (!base) return
      base.setHours(hour, partIndex === 0 ? 0 : step * partIndex, 0, 0)
      onValueChange(base)
    },
    [locale, value, onValueChange, onTimeChange],
  )

  const handleKeydown = React.useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      e.stopPropagation()
      if (!document) return

      const moveNext = () => {
        const next = activeIndex + 1 > DEFAULT_SIZE - 1 ? 0 : activeIndex + 1
        document.getElementById(`time-${next}`)?.focus()
        setActiveIndex(next)
      }
      const movePrev = () => {
        const prev = activeIndex - 1 < 0 ? DEFAULT_SIZE - 1 : activeIndex - 1
        document.getElementById(`time-${prev}`)?.focus()
        setActiveIndex(prev)
      }
      const setElement = () => {
        const el = document.getElementById(`time-${activeIndex}`)
        if (!el) return
        el.focus()
        const text = el.textContent ?? '00:00'         // "HH:mm"
        const [hStr, mStr] = text.split(':')
        const hour = parseInt(hStr, 10)
        const minutes = parseInt(mStr, 10)
        const part = Math.floor(minutes / step)
        formatSelectedTime(text, hour, part)
      }
      const reset = () => {
        document.getElementById(`time-${activeIndex}`)?.blur()
        setActiveIndex(-1)
      }

      switch (e.key) {
        case 'ArrowUp': movePrev(); break
        case 'ArrowDown': moveNext(); break
        case 'Escape': reset(); break
        case 'Enter': setElement(); break
      }
    },
    [activeIndex, formatSelectedTime],
  )

  const handleClick = React.useCallback(
    (hour: number, part: number, currentIndex: number) => {
      const display = `${String(hour).padStart(2,'0')}:${String(part === 0 ? 0 : step * part).padStart(2,'0')}`
      formatSelectedTime(display, hour, part)
      setActiveIndex(currentIndex)
    },
    [formatSelectedTime],
  )

  const currentTime = React.useMemo(() => {
    const base = Time || '00:00'
    const [hStr, mStr] = base.split(':')
    return { hours: parseInt(hStr || '0', 10), minutes: parseInt(mStr || '0', 10) }
  }, [Time])

  React.useEffect(() => {
    const alignToCurrent = () => {
      const hours = currentTime.hours
      const minutes = currentTime.minutes
      for (let j = 0; j <= 3; j++) {
        const diff = Math.abs(j * step - minutes)
        const selected = minutes <= 53 ? diff < Math.ceil(step / 2) : diff < step
        if (selected) {
          const index = activeIndex === -1 ? hours * 4 + j : activeIndex
          setActiveIndex(index)
          document.getElementById(`time-${index}`)?.scrollIntoView({
            block: 'center',
            behavior: 'smooth',
          })
        }
      }
    }
    alignToCurrent()
  }, [currentTime, activeIndex])

  const height = React.useMemo(() => {
    const el = document.getElementById('calendar')
    return el ? `${el.getBoundingClientRect().height}px` : undefined
  }, [])

  return (
    <div className="space-y-2 pr-3 py-3 relative ">
      <ScrollArea
        onKeyDown={handleKeydown}
        className="h-full w-full focus-visible:outline-0 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-0 py-0.5"
        style={{ height }}
      >
        <ul className={cn('flex items-center flex-col gap-1 h-full max-h-56 w-28 px-1 py-0.5')}>
          {Array.from({ length: 24 }).flatMap((_, i) => {
            return Array.from({ length: 4 }).map((_, part) => {
              const minutes = part === 0 ? 0 : step * part
              const isSameHour = currentTime.hours === i
              const diff = Math.abs(minutes - currentTime.minutes)
              const isSelected =
                isSameHour &&
                (currentTime.minutes <= 53 ? diff < Math.ceil(step / 2) : diff < step)
              const isSuggested = !value && isSelected
              const val = `${String(i).padStart(2,'0')}:${String(minutes).padStart(2,'0')}`
              const idx = i * 4 + part
              return (
                <li
                  tabIndex={isSelected ? 0 : -1}
                  id={`time-${idx}`}
                  key={`time-${idx}`}
                  aria-label="currentTime"
                  className={cn(
                    buttonVariants({
                      variant: isSuggested ? 'secondary' : isSelected ? 'default' : 'outline',
                    }),
                    'h-8 px-3 w-full text-sm focus-visible:outline-0 outline-0 focus-visible:border-0 cursor-default ring-0',
                  )}
                  onClick={() => handleClick(i, part, idx)}
                  onFocus={() => isSuggested && setActiveIndex(idx)}
                >
                  {val}
                </li>
              )
            })
          })}
        </ul>
      </ScrollArea>
    </div>
  )
}

/* --------------------------- Natural language input --------------------------- */

const NaturalLanguageInput = React.forwardRef<
  HTMLInputElement,
  { locale: Locale; placeholder?: string; disabled?: boolean }
>(({ locale, placeholder, ...props }, ref) => {
  const { value, onValueChange, Time, onTimeChange } = useSmartDateInput()

  const ph =
    placeholder ??
    (locale.code.split('-')[0] === 'fr'
      ? 'e.g. "demain à 17h" ou "dans 2 heures"'
      : 'e.g. "tomorrow at 17:00" or "in 2 hours"')

  const [inputValue, setInputValue] = React.useState<string>('')

  React.useEffect(() => {
    const now = new Date()
    const base = `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`
    setInputValue(value ? formatDateTime(value, locale) : '')
    onTimeChange(value ? Time : base)
  }, [locale, value, Time, onTimeChange])

  const commit = React.useCallback((raw: string) => {
    if (raw === '') {
      onTimeChange('')
      onValueChange(null)
      return
    }
    const parsed = parseDateTime(raw, locale)
    if (!parsed) return
    onValueChange(parsed)
    setInputValue(formatDateTime(parsed, locale))
    onTimeChange(`${String(parsed.getHours()).padStart(2,'0')}:${String(parsed.getMinutes()).padStart(2,'0')}`)
  }, [locale, onValueChange, onTimeChange])

  return (
    <Input
      ref={ref}
      type="text"
      placeholder={ph}
      value={inputValue}
      onChange={(e) => setInputValue(e.target.value)}
      onKeyDown={(e) => e.key === 'Enter' && commit(e.currentTarget.value)}
      onBlur={(e) => commit(e.currentTarget.value)}
      className={cn('px-2 mr-0.5 flex-1 border-none h-8 rounded', inputBase)}
      {...props}
    />
  )
})
NaturalLanguageInput.displayName = 'NaturalLanguageInput'

/* ---------------------------- Date button + popover --------------------------- */

const DateTimeLocalInput = ({ locale, disabled }: { locale: Locale; disabled?: boolean }) => {
  const {
    value,
    onValueChange,
    Time,
    captionLayout,
    startMonth,
    endMonth,
    showOutsideDays,
    defaultMonth,
    numberOfMonths,
    weekStartsOn,
    className,
  } = useSmartDateInput()

  const onPick = (date?: Date) => {
    if (!date) return
    const parsed = parseDateTime(date, locale)
    if (!parsed) return
    const [hStr, mStr] = (Time || '00:00').split(':')
    parsed.setHours(parseInt(hStr || '0',10), parseInt(mStr || '0',10), 0, 0)
    onValueChange(parsed)
  }

  const disabledMatchers = [
    ...(startMonth ? [{ before: new Date(startMonth.getFullYear(), startMonth.getMonth(), 1) }] : []),
    ...(endMonth   ? [{ after:  new Date(endMonth.getFullYear(),   endMonth.getMonth() + 1, 0) }] : []),
  ]

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          disabled={disabled}
          className={cn('size-9 flex items-center justify-center font-normal', !value && 'text-muted-foreground')}
        >
          <CalendarIcon className="size-4" />
          <span className="sr-only">calendar</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" sideOffset={8}>
        <div className="flex gap-1">
          <Calendar
            id="calendar"
            className={cn('peer flex justify-end', inputBase, className)}
            mode="single"
            selected={value ?? undefined}
            onSelect={onPick}
            autoFocus
            /* ✅ react-day-picker v9 API, fast year/month selection */
            captionLayout={captionLayout ?? 'dropdown'}
            startMonth={startMonth ?? new Date(1900, 0)}
            endMonth={endMonth ?? new Date(new Date().getFullYear(), 11)}
            showOutsideDays={showOutsideDays ?? true}
            defaultMonth={defaultMonth}
            numberOfMonths={numberOfMonths}
            weekStartsOn={weekStartsOn}
            /* Optional hard bounds on clickable days */
            disabled={disabledMatchers.length ? disabledMatchers : undefined}
          />
          <TimePicker locale={locale} />
        </div>
      </PopoverContent>
    </Popover>
  )
}

DateTimeLocalInput.displayName = 'DateTimeLocalInput'
