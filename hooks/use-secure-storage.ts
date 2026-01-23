/**
 * Hook for secure storage
 * 
 * Manages password-protected encrypted storage for sensitive data
 */

import { useState, useCallback, useEffect } from 'react';
import { secureStorage } from '@/services/storage/secure-storage';

interface UseSecureStorageReturn {
  isUnlocked: boolean;
  isInitialized: boolean;
  initialize: (password: string) => Promise<void>;
  unlock: (password: string) => Promise<boolean>;
  lock: () => void;
  saveItem: (key: string, value: string) => Promise<void>;
  getItem: (key: string) => Promise<string | null>;
  removeItem: (key: string) => Promise<void>;
  error: Error | null;
}

export function useSecureStorage(): UseSecureStorageReturn {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Check if already initialized
  useEffect(() => {
    checkInitialized();
  }, []);

  const checkInitialized = async () => {
    try {
      const salt = await import('expo-secure-store').then(store => 
        store.getItemAsync('encryption_salt')
      );
      setIsInitialized(!!salt);
    } catch (err) {
      setError(err as Error);
    }
  };

  const initialize = useCallback(async (password: string) => {
    try {
      setError(null);
      await secureStorage.initialize(password);
      setIsUnlocked(true);
      setIsInitialized(true);
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  }, []);

  const unlock = useCallback(async (password: string): Promise<boolean> => {
    try {
      setError(null);
      const success = await secureStorage.unlock(password);
      setIsUnlocked(success);
      return success;
    } catch (err) {
      setError(err as Error);
      return false;
    }
  }, []);

  const lock = useCallback(() => {
    secureStorage.lock();
    setIsUnlocked(false);
  }, []);

  const saveItem = useCallback(async (key: string, value: string) => {
    try {
      setError(null);
      await secureStorage.setItem(key, value);
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  }, []);

  const getItem = useCallback(async (key: string): Promise<string | null> => {
    try {
      setError(null);
      return await secureStorage.getItem(key);
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  }, []);

  const removeItem = useCallback(async (key: string) => {
    try {
      setError(null);
      await secureStorage.removeItem(key);
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  }, []);

  return {
    isUnlocked,
    isInitialized,
    initialize,
    unlock,
    lock,
    saveItem,
    getItem,
    removeItem,
    error,
  };
}
