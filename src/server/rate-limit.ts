const ipRateMap = new Map<string, { count: number; timestamp: number }>();
const MAX_REQUESTS = 5;
const WINDOW_MS = 60_000;

export function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = ipRateMap.get(ip);

  if (!entry || now - entry.timestamp > WINDOW_MS) {
    ipRateMap.set(ip, { count: 1, timestamp: now });
    return true;
  }

  if (entry.count < MAX_REQUESTS) {
    entry.count++;
    return true;
  }

  return false;
}
