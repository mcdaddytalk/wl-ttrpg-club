import logger from "@/utils/logger";

export async function fetcher<T>(
  url: string,
  options?: RequestInit,
  params?: URLSearchParams
): Promise<T> {
    const fullUrl = params ? `${url}?${params.toString()}` : url;

    const response = await fetch(fullUrl, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
    });
  
    logger.info(`API Response: ${response.status} ${response.statusText}`);
    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }
  
    return response.json();
  }
  
  export default fetcher;  