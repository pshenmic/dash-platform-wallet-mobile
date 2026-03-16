import * as SecureStore from 'expo-secure-store'

const ATTEMPTS_KEY = 'pin_failed_attempts'
const LOCKOUT_UNTIL_KEY = 'pin_lockout_until'
export const MAX_ATTEMPTS_BEFORE_LOCKOUT = 5

/**
 * Returns the lockout duration in milliseconds for a given number of failed attempts.
 * Returns 0 if below the lockout threshold, otherwise exponentially increases up to 30 minutes.
 */
export function getLockoutDurationMs(attempts: number): number {
  if (attempts < MAX_ATTEMPTS_BEFORE_LOCKOUT) return 0
  const extra = attempts - MAX_ATTEMPTS_BEFORE_LOCKOUT
  return Math.min(30_000 * Math.pow(2, extra), 30 * 60_000)
}

/**
 * Reads the current failed PIN attempt count from secure storage.
 * Returns 0 if no record exists.
 */
export async function getFailedAttempts(): Promise<number> {
  const val = await SecureStore.getItemAsync(ATTEMPTS_KEY)
  return val ? parseInt(val, 10) : 0
}

/**
 * Increments the failed attempt counter in secure storage.
 * If the new count triggers a lockout, also persists the lockout expiry timestamp.
 * Returns the updated attempt count.
 */
export async function incrementFailedAttempts(): Promise<number> {
  const current = await getFailedAttempts()
  const next = current + 1
  await SecureStore.setItemAsync(ATTEMPTS_KEY, String(next))
  const lockoutMs = getLockoutDurationMs(next)
  if (lockoutMs > 0) {
    await SecureStore.setItemAsync(LOCKOUT_UNTIL_KEY, String(Date.now() + lockoutMs))
  }
  return next
}

/**
 * Clears the failed attempt counter and lockout timestamp from secure storage.
 * Called on successful login or after a PIN reset.
 */
export async function clearFailedAttempts(): Promise<void> {
  await SecureStore.deleteItemAsync(ATTEMPTS_KEY)
  await SecureStore.deleteItemAsync(LOCKOUT_UNTIL_KEY)
}

/**
 * Returns the number of milliseconds remaining in the current lockout period.
 * Returns 0 if there is no active lockout.
 */
export async function getLockoutRemainingMs(): Promise<number> {
  const val = await SecureStore.getItemAsync(LOCKOUT_UNTIL_KEY)
  if (!val) return 0
  const until = parseInt(val, 10)
  return Math.max(0, until - Date.now())
}
