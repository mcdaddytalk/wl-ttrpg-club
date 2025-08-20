import { DaysOfWeek, DOW, GameData, GameInterval, ProfileData } from "@/lib/types/custom";
import { ENVS } from "@/utils/constants/envs"
import { NextRequest } from "next/server";
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import relativeTime from 'dayjs/plugin/relativeTime';
import logger from "./logger";

// Setup dayjs extensions
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(localizedFormat);
dayjs.extend(relativeTime);

// You can centralize your app's default timezone here
const DEFAULT_TIMEZONE = 'America/New_York';

interface FormatDateOptions {
  formatStr?: string;           // The format to apply
  fallbackFormatStr?: string;   // A second-chance format if parsing fails
  forceUTC?: boolean;           // Force UTC mode
  timezone?: string;            // Force a specific timezone
}

export function formatDate(
  value?: string | number | Date | null,
  options?: FormatDateOptions
): string {
  if (!value) return '—';

  const {
    formatStr = 'LLL',              // Default to "May 8, 2025 9:30 AM"
    fallbackFormatStr = 'YYYY-MM-DD HH:mm',
    forceUTC = false,
    timezone: customTimezone,
  } = options || {};

  let parsed = dayjs(value);

  if (!parsed.isValid()) {
    return '—';
  }

  if (forceUTC) {
    parsed = parsed.utc();
  } else if (customTimezone) {
    parsed = parsed.tz(customTimezone);
  } else if (DEFAULT_TIMEZONE) {
    parsed = parsed.tz(DEFAULT_TIMEZONE);
  }

  try {
    return parsed.format(formatStr);
  } catch (err) {
    // fallback in case formatStr fails
    logger.warn('Failed to format date:', err);
    return parsed.format(fallbackFormatStr);
  }
}

export function formatRelativeDate(
  value?: string | number | Date | null,
  referenceDate?: string | number | Date // optional 'from' date (defaults to now)
): string {
  if (!value) return '—';

  const parsed = dayjs(value);
  if (!parsed.isValid()) return '—';

  const from = referenceDate ? dayjs(referenceDate) : dayjs();
  if (!from.isValid()) return parsed.fromNow(); // fallback if 'from' is invalid

  return parsed.from(from);
}

/**
 * Convert an ISO/timestamptz string or Date to a "YYYY-MM-DDTHH:mm" local string
 * suitable for <input type="datetime-local">.
 *
 * @param input ISO string | Date | null/undefined
 * @param tz Optional IANA timezone (e.g., "America/Chicago").
 *           If provided, formats in that zone; otherwise uses the user's local time.
 */
export function toDatetimeLocal(input?: string | Date | null, tz?: string): string {
  if (!input) return "";

  const d = typeof input === "string" ? dayjs(input) : dayjs(input);
  if (!d.isValid()) return "";

  const inZone = tz ? d.tz(tz) : d.local();
  return inZone.format("YYYY-MM-DDTHH:mm");
}

export function fromDatetimeLocal(value: string): string {
    return dayjs(value).toISOString()
  }

export function formatRecurrence(interval?: string, dayOfWeek?: DOW): string {
  const label = dayOfWeek ? toSentenceCase(dayOfWeek) : "Unscheduled"
  const suffix = interval ? ` (${toSentenceCase(interval)})` : ""
  return `Every ${label}${suffix}`
}

export function formatSessionTiming(date?: string | null): {
  label: string
  isOverdue: boolean
  fullDate?: string
} {
  if (!date) return { label: "Not Scheduled", isOverdue: false }

  const now = dayjs()
  const session = dayjs(date)

  if (session.isBefore(now, "minute")) {
    return {
      label: `⚠️ Overdue`,
      isOverdue: true,
      fullDate: session.format("dddd, MMMM D [at] h:mm A"),
    }
  }

  return {
    label: `📅 ${session.fromNow()}`,
    isOverdue: false,
    fullDate: session.format("dddd, MMMM D [at] h:mm A"),
  }
}

export const getURL = (path: string = '') => {
    // Check if NEXT_PUBLIC_SITE_URL is set and non-empty. Set this to your site URL in production env.
    let url =
        ENVS.NEXT_PUBLIC_SITE_URL &&
            ENVS.NEXT_PUBLIC_SITE_URL.trim() !== ''
            ? ENVS.NEXT_PUBLIC_SITE_URL
            : 'http://localhost:3000/';

    // Trim the URL and remove trailing slash if exists.
    url = url.replace(/\/+$/, '');
    // Make sure to include `https://` when not localhost.
    url = url.includes('http') ? url : `https://${url}`;
    // Ensure path starts without a slash to avoid double slashes in the final URL.
    path = path.replace(/^\/+/, '');

    // Concatenate the URL and the path.
    return path ? `${url}/${path}` : url;
};

// export const formatDate = (isoString: string): string => {
//     const date = new Date(isoString);
//     const options: Intl.DateTimeFormatOptions = {
//       year: "numeric",
//       month: "long",
//       day: "numeric",
//     };
//     return new Intl.DateTimeFormat("en-US", options).format(date);
// };

export const calculateNextGameDate = (dayOfWeek: DOW, interval: GameInterval, date?: string | null) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (date) {
      const incomingDate = new Date(date);
      incomingDate.setHours(0, 0, 0, 0);
      if (incomingDate > today) {
        return incomingDate.toISOString();
      }
    }
    // If date is not provided or is not in the future, calculate the next game date
    const targetDay = DaysOfWeek.indexOf(dayOfWeek);
    const currentDay = today.getDay();
    const daysUntilNext = (targetDay - currentDay + 7) % 7 || 7; // At least 1 week in the future

    const nextDate = new Date(today);
    nextDate.setDate(today.getDate() + daysUntilNext);
    
    if (interval === 'weekly') {
      return nextDate.toISOString();
    }
    
    if (interval === 'biweekly') {
      nextDate.setDate(nextDate.getDate() + 7);
      return nextDate.toISOString();
    }
    if (interval === 'monthly') {
      nextDate.setMonth(nextDate.getMonth() + 1);
      return nextDate.toISOString();
    }
    if (interval === 'custom') {
      return nextDate.toISOString();
    }

    return nextDate.toISOString();
  };

  export function getRange(page: number, limit: number) {
    const from = page * limit;
    const to = from + limit - 1;
    return { from, to };
  }

  // ✅ In-Memory Rate Limiting
  export const rateLimitMap = new Map<string, { count: number; lastRequest: number }>();
  export const RATE_LIMIT = { maxRequests: 10, timeWindow: 60 * 1000 }; // 10 requests per minute
  
  // ✅ Role Hierarchy (Admins inherit all permissions)
  export const ROLE_HIERARCHY: Record<string, string[]> = {
    admin: ["admin", "gamemaster", "member"],
    gamemaster: ["gamemaster", "member"],
    member: ["member"],
  };

  export function getRoleHierarchy(role: string): string[] {
    return ROLE_HIERARCHY[role] || [];
  }

  export function hasPermission(userRole: string, requiredRole: string): boolean {
    return getRoleHierarchy(userRole).includes(requiredRole);
  }

  export const getRoleBadgeStyle = (role: string): string => {
    if (!role) return 'bg-muted text-muted-foreground';
    switch (role.toLowerCase()) {
      case 'admin':
        return 'bg-red-100 text-red-700 border border-red-300';
      case 'gamemaster':
        return 'bg-purple-100 text-purple-700 border border-purple-300';
      case 'member':
        return 'bg-green-100 text-green-700 border border-green-300';
      default:
        return 'bg-muted text-muted-foreground';
    }
  }
  
  export const statusBadge = (status: string): string => {
      switch (status) {
        case "draft": return "bg-yellow-100 text-yellow-800 border border-yellow-300"
        case "active": return "bg-green-100 text-green-800 border border-green-300"
        case "cancelled": return "bg-red-100 text-red-700 border border-red-300"
        default: return "bg-muted text-muted-foreground"
      }
  } 
    
  export const locationBadge = (type: string): string => {
      if (!type) return 'bg-muted text-muted-foreground';
      switch (type) {
        case "vtt": return "bg-blue-100 text-blue-800 border border-blue-300"
        case "discord": return "bg-purple-100 text-purple-800 border border-purple-300"
        case "physical": return "bg-orange-100 text-orange-800 border border-orange-300"
        default: return "bg-muted text-muted-foreground"
      }
    }
  
  
  // Function to safely extract IP from request headers
  export const getClientIp = (req: NextRequest): string => {
    // Try to get IP from standard "x-forwarded-for" header (proxy-aware)
    const forwardedFor = req.headers.get("x-forwarded-for");
    if (forwardedFor) {
      return forwardedFor.split(",")[0].trim(); // Take the first IP in the list
    }
  
    // Fallback for environments without a proxy
    return req.headers.get("cf-connecting-ip") || "127.0.0.1"; // Default to localhost for safety
  };

  export function transformObjectToParams(object: {
    [key: string]: string | number | undefined | null;
  }) {
    const params = Object.entries(object)
      .filter(([, value]) => value !== undefined && value !== null)
      .map(
        ([key, value]) =>
          `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`,
      );
  
    return params.length > 0 ? `?${params.join('&')}` : '';
  }

  export function toSearchParams(obj: Record<string, unknown>): URLSearchParams {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(obj)) {
      if (value !== undefined && value !== null) {
        params.set(key, String(value));
      }
    }
    return params;
  }

  export function toSentenceCase(str: string) {
    return str
      .replace(/_/g, " ")
      .replace(/([A-Z])/g, " $1")
      .toLowerCase()
      .replace(/^\w/, (c) => c.toUpperCase())
      .replace(/\s+/g, " ")
      .trim()
  }

  export function capitalize(s: string) { return s ? s[0].toUpperCase() + s.slice(1) : s; }
  
  export const seatsAvailable = (game: GameData) => {
      if (game.currentSeats === null) return "N/A";
      if (game.maxSeats === null) return "N/A";
      if (game.maxSeats - game.currentSeats === 0) return "Full";
      return `${game.currentSeats} / ${game.maxSeats}`;
  };

export function getDisplayName(profile: Partial<ProfileData>): string {
  const given = profile.given_name?.trim() || "";
  const surname = profile.surname?.trim() || "";

  if (given && surname) return `${given} ${surname}`;
  return given || surname || "Unknown Member";
}