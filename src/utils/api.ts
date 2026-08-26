const DEFAULT_TIMEOUT_MS = 90000;
const DEFAULT_RETRIES = 3;
const RETRY_DELAY_MS = 15000;

export async function fetchWithRetry(
  url: string,
  options?: RequestInit,
  config?: { retries?: number; timeoutMs?: number; retryDelayMs?: number }
): Promise<Response> {
  const retries = config?.retries ?? DEFAULT_RETRIES;
  const timeoutMs = config?.timeoutMs ?? DEFAULT_TIMEOUT_MS;
  const retryDelayMs = config?.retryDelayMs ?? RETRY_DELAY_MS;

  let lastError: unknown;

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const res = await fetch(url, {
        ...options,
        signal: AbortSignal.timeout(timeoutMs),
      });
      return res;
    } catch (err) {
      lastError = err;
      if (attempt < retries) {
        await new Promise((resolve) => setTimeout(resolve, retryDelayMs));
      }
    }
  }

  throw lastError;
}
