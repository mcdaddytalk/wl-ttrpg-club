import { format } from 'date-fns';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import Image from 'next/image';
import Link from 'next/link';

/** Boolean cell with icon + tooltip */
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

export function BooleanCellWithTooltip({
  value,
  label,
  tooltipLabel,
}: {
  value: boolean;
  label: string;
  tooltipLabel?: string;
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span title={label}>
          <Check
            className={cn('w-4 h-4', value ? 'text-green-600' : 'text-slate-400')}
            aria-hidden="true"
          />
        </span>
      </TooltipTrigger>
      <TooltipContent>
        {tooltipLabel || `${label}: ${value ? 'Yes' : 'No'}`}
      </TooltipContent>
    </Tooltip>
  );
}

/** Date cell with formatted date + tooltip for ISO */
export function DateCell({
  date,
  label = 'Date',
  formatStr = 'PPPp',
}: {
  date?: string | null;
  label?: string;
  formatStr?: string;
}) {
  if (!date) return <span className="text-muted-foreground">—</span>;
  const parsed = new Date(date);
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span>{format(parsed, formatStr)}</span>
      </TooltipTrigger>
      <TooltipContent>{`${label}: ${parsed.toISOString()}`}</TooltipContent>
    </Tooltip>
  );
}

/** Text with Upper cased first letter cell */
export function TextUppercaseCell({ 
    value 
}: { 
    value: string;
}) {
    return (
        <span className="text-sm font-medium ">{value.charAt(0).toUpperCase() + value.slice(1)}</span>
    )
}

/** Link cell with optional target */
export function LinkCell({
  href,
  label,
  external = false,
}: {
  href: string;
  label?: string;
  external?: boolean;
}) {
  return (
    <Link
      href={href}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
      className="text-blue-600 underline hover:text-blue-800"
    >
      {label || href}
    </Link>
  );
}

/** Avatar cell */
export function AvatarCell({
  src,
  alt = 'Avatar',
  size = 32,
}: {
  src?: string | null;
  alt?: string;
  size?: number;
}) {
  return src ? (
    <Image
      src={src}
      alt={alt}
      width={size}
      height={size}
      className="rounded-full object-cover"
    />
  ) : (
    <div
      className="bg-gray-200 rounded-full flex items-center justify-center text-xs text-gray-600"
      style={{ width: size, height: size }}
    >
      ?
    </div>
  );
}