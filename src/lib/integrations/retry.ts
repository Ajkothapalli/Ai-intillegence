import { isRateLimitError } from './errors'

export async function withRetry<T>(
  fn: () => Promise<T>,
  maxAttempts = 3,
  baseDelayMs = 1000,
): Promise<T> {
  let lastErr: unknown
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    try {
      return await fn()
    } catch (err) {
      lastErr = err
      const isRetryable = isRateLimitError(err) || (err instanceof Error && /network|timeout|ECONNRESET/i.test(err.message))
      if (!isRetryable || attempt === maxAttempts - 1) throw err
      await new Promise(res => setTimeout(res, baseDelayMs * 2 ** attempt))
    }
  }
  throw lastErr
}
