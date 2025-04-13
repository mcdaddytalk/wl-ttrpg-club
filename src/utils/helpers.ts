import { DOW, GameInterval, GameSchedStatus } from "@/lib/types/custom";
import { ENVS } from "@/utils/constants/envs"
import { NextRequest } from "next/server";

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

export const formatDate = (isoString: string): string => {
    const date = new Date(isoString);
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Intl.DateTimeFormat("en-US", options).format(date);
};

export const daysOfWeek: DOW[] = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
export const intervals: GameInterval[] = ['weekly', 'biweekly', 'monthly', 'yearly', 'custom'];
export const gameStatuses: GameSchedStatus[] = ['draft', 'active', 'awaiting-players', 'full', 'scheduled', 'canceled', 'completed'];

export const calculateNextGameDate = (dayOfWeek: DOW, interval: GameInterval, date?: Date) => {
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
    const targetDay = daysOfWeek.indexOf(dayOfWeek);
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

  export function toSearchParams(obj: Record<string, unknown>): URLSearchParams {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(obj)) {
      if (value !== undefined && value !== null) {
        params.set(key, String(value));
      }
    }
    return params;
  }