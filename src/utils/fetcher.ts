import logger from "@/utils/logger";

function makeAbsoluteUrl(pathOrUrl: string, params?: URLSearchParams) {
  // If it's already absolute, just append params and return.
  if (/^https?:\/\//i.test(pathOrUrl)) {
    return params ? `${pathOrUrl}?${params.toString()}` : pathOrUrl;
  }

  // If we're in the browser, ALWAYS keep it relative (same-origin).
  if (typeof window !== "undefined") {
    return params ? `${pathOrUrl}?${params.toString()}` : pathOrUrl;
  }

  // Server-side: build an absolute URL using your configured site URL.
  const base =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/+$/, "") ??
    "http://localhost:3000";
  const path = pathOrUrl.replace(/^\/+/, "");
  return params ? `${base}/${path}?${params.toString()}` : `${base}/${path}`;
}

export async function fetcher<T>(
  url: string,
  options?: RequestInit,
  params?: URLSearchParams
): Promise<T> {
    const fullUrl = makeAbsoluteUrl(url, params);

    logger.debug(`API Request: ${fullUrl}`);

    const isFormData = options?.body instanceof FormData;
    const headers = isFormData
      ? options.headers
      : { "Content-Type": "application/json", ...options?.headers };

    if (isFormData) {
      logger.debug(`API Request Body: ${options?.body?.toString()}`);
      logger.debug(`API Request Headers: ${JSON.stringify(headers)}`);
    }
    const response = await fetch(fullUrl, {
      ...options,
      headers
    });
  
    logger.debug(`API Response: ${response.status} ${response.statusText}`);
    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }
  
    // 🔑 Handle 204/empty responses gracefully
    if (response.status === 204) return undefined as unknown as T;

    const text = await response.text();
    if (!text) return undefined as unknown as T;

    try {
      return JSON.parse(text) as T;
    } catch {
      // Not JSON; return as-is (useful if your API sometimes returns plain text)
      return text as unknown as T;
    }
  }
  
  export default fetcher;  