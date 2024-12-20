import { DOW, GameInterval, GameStatus } from "@/lib/types/custom";

export const getURL = (path: string = '') => {
    // Check if NEXT_PUBLIC_SITE_URL is set and non-empty. Set this to your site URL in production env.
    let url =
        process?.env?.NEXT_PUBLIC_SITE_URL &&
            process.env.NEXT_PUBLIC_SITE_URL.trim() !== ''
            ? process.env.NEXT_PUBLIC_SITE_URL
            : // If not set, check for NEXT_PUBLIC_VERCEL_URL, which is automatically set by Vercel.
            process?.env?.NEXT_PUBLIC_VERCEL_URL &&
                process.env.NEXT_PUBLIC_VERCEL_URL.trim() !== ''
                ? process.env.NEXT_PUBLIC_VERCEL_URL
                : // If neither is set, default to localhost for local development.
                'http://localhost:3000/';

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
export const gameStatuses: GameStatus[] = ['draft', 'active', 'awaiting-players', 'full', 'scheduled', 'canceled', 'completed'];

export const calculateNextGameDate = (dayOfWeek: DOW, interval: GameInterval, date?: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (date) {
      //const nextDate = new Date(date);
      //nextDate.setDate(nextDate.getDate() + 7);
      //return nextDate.toISOString();
      const incomingDate = new Date(date);
      incomingDate.setHours(0, 0, 0, 0);
    // console.log('today', today)
    // console.log('incomingDate', incomingDate)
      if (incomingDate > today) {
      // console.log('nextDate[incoming]', incomingDate);
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
    // console.log('nextDate[weekly]', nextDate);
      return nextDate.toISOString();
    }
    
    if (interval === 'biweekly') {
      nextDate.setDate(nextDate.getDate() + 7);
    // console.log('nextDate[biweekly]', nextDate);
      return nextDate.toISOString();
    }
    if (interval === 'monthly') {
      nextDate.setMonth(nextDate.getMonth() + 1);
    // console.log('nextDate[monthly]', nextDate);
      return nextDate.toISOString();
    }
    if (interval === 'custom') {
    // console.log('nextDate[custom]', nextDate);
      return nextDate.toISOString();
    }

    return nextDate.toISOString();
  };

  export function getRange(page: number, limit: number) {
    const from = page * limit;
    const to = from + limit - 1;
    return { from, to };
  }