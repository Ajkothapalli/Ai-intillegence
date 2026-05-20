export class IntegrationAuthError extends Error {
  readonly code = 'AUTH_ERROR'
  constructor(platform: string, status: number) {
    super(`${platform}: credentials rejected (HTTP ${status}). Re-connect to update your API key.`)
    this.name = 'IntegrationAuthError'
  }
}

export class IntegrationRateLimitError extends Error {
  readonly code = 'RATE_LIMIT'
  constructor(platform: string) {
    super(`${platform}: rate limit exceeded. Sync will be retried automatically.`)
    this.name = 'IntegrationRateLimitError'
  }
}

export class IntegrationNotFoundError extends Error {
  readonly code = 'NOT_FOUND'
  constructor(platform: string, resource: string) {
    super(`${platform}: ${resource} not found. Check that the project/resource ID is correct.`)
    this.name = 'IntegrationNotFoundError'
  }
}

export function isAuthError(err: unknown): err is IntegrationAuthError {
  return err instanceof IntegrationAuthError
}

export function isRateLimitError(err: unknown): err is IntegrationRateLimitError {
  return err instanceof IntegrationRateLimitError
}
