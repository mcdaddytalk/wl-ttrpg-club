import logger from "@/utils/logger";

export async function fetcher<T>(
  url: string,
  options?: RequestInit,
  params?: URLSearchParams
): Promise<T> {
    const fullUrl = params ? `${url}?${params.toString()}` : url;

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
  
    return response.json();
  }
  
  export default fetcher;  