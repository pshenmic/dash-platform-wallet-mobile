/**
 * Custom error classes
 */

export class StorageError extends Error {
  constructor(
    message: string,
    public code?: string,
    public details?: any
  ) {
    super(message)
    this.name = 'StorageError'
  }
}

export class AuthenticationError extends Error {
  constructor(
    message: string,
    public code?: string,
    public details?: any
  ) {
    super(message)
    this.name = 'AuthenticationError'
  }
}
