import { describe, it, expect, vi } from 'vitest'
import { withRetry } from '@/lib/integrations/retry'

describe('withRetry', () => {
  it('returns the result on first success', async () => {
    const fn = vi.fn().mockResolvedValue('ok')
    const result = await withRetry(fn, 3, 0)
    expect(result).toBe('ok')
    expect(fn).toHaveBeenCalledTimes(1)
  })

  it('retries on retryable error and eventually succeeds', async () => {
    let calls = 0
    const fn = vi.fn().mockImplementation(async () => {
      calls++
      if (calls < 3) throw new Error('network error')
      return 'success'
    })
    const result = await withRetry(fn, 3, 0)
    expect(result).toBe('success')
    expect(fn).toHaveBeenCalledTimes(3)
  })

  it('does not retry on non-retryable error', async () => {
    const fn = vi.fn().mockRejectedValue(new Error('Validation failed'))
    await expect(withRetry(fn, 3, 0)).rejects.toThrow('Validation failed')
    expect(fn).toHaveBeenCalledTimes(1)
  })

  it('throws after exhausting max attempts on retryable error', async () => {
    const fn = vi.fn().mockRejectedValue(new Error('timeout'))
    await expect(withRetry(fn, 3, 0)).rejects.toThrow('timeout')
    expect(fn).toHaveBeenCalledTimes(3)
  })
})
