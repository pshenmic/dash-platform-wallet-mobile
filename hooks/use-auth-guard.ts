/**
 * Auth Guard Hook
 *
 * Checks authentication status and redirects to the appropriate screen
 * when the user is not authenticated. Calls onAuthenticated when the
 * user is fully authenticated and a wallet exists.
 */

import { router } from 'expo-router';
import { useEffect } from 'react';

import { useSecureStorage } from '@/contexts/SecureStorageContext';

export interface UseAuthGuardOptions {
  /**
   * Called when auth check passes: password set, storage unlocked, wallet exists.
   */
  onAuthenticated: () => void;
}

/**
 * Runs auth guard checks whenever isInitialized or isUnlocked state changes.
 *
 * Redirect map:
 *   no salt         → /setup-password
 *   locked          → /login
 *   no seed phrase  → /welcome
 *   all clear       → onAuthenticated()
 */
export function useAuthGuard({ onAuthenticated }: UseAuthGuardOptions): void {
  const { isInitialized, isUnlocked, getItem } = useSecureStorage();

  useEffect(() => {
    // Context is still performing its initial salt check — wait for it
    if (isInitialized === null) return;

    const checkAuth = async () => {
      try {
        if (!isInitialized) {
          console.log('[useAuthGuard] No salt found, redirecting to setup-password');
          router.replace('/setup-password');
          return;
        }

        if (!isUnlocked) {
          console.log('[useAuthGuard] Storage locked, redirecting to login');
          router.replace('/login');
          return;
        }

        const seedPhrase = await getItem('wallet_seed_phrase');
        if (!seedPhrase) {
          console.log('[useAuthGuard] No wallet found, redirecting to welcome');
          router.replace('/welcome');
          return;
        }

        console.log('[useAuthGuard] Auth check passed');
        onAuthenticated();
      } catch (error) {
        console.error('[useAuthGuard] Auth check failed:', error);
        router.replace('/login');
      }
    };

    checkAuth();
  }, [isInitialized, isUnlocked, getItem, onAuthenticated]);
}
