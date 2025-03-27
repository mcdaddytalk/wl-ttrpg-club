import logger from "@/utils/logger";

export async function fetcher<T>(url: string, options?: RequestInit): Promise<T> {
    const response = await fetch(url, {
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