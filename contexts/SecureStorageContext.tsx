/**
 * Global Context for Secure Storage state
 * 
 * Shares isUnlocked and isInitialized state across all components
 */

import { createContext, useContext, ReactNode, useState, useCallback, useEffect } from 'react';
import { secureStorage } from '@/services/storage/secure-storage';
import * as SecureStore from 'expo-secure-store';

interface SecureStorageContextType {
  isUnlocked: boolean;
  isInitialized: boolean | null;
  initialize: (password: string) => Promise<void>;
  unlock: (password: string) => Promise<boolean>;
  lock: () => void;
  saveItem: (key: string, value: string) => Promise<void>;
  getItem: (key: string) => Promise<string | null>;
  removeItem: (key: string) => Promise<void>;
  reset: () => Promise<void>;
  error: Error | null;
}

const SecureStorageContext = createContext<SecureStorageContextType | undefined>(undefined);

export function SecureStorageProvider({ children }: { children: ReactNode }) {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isInitialized, setIsInitialized] = useState<boolean | null>(null);
  const [error, setError] = useState<Error | null>(null);

  const checkInitialized = useCallback(async () => {
    try {
      const salt = await SecureStore.getItemAsync('encryption_salt');
      const initialized = !!salt;
      console.log('[SecureStorageContext] checkInitialized - salt exists:', initialized);
      setIsInitialized(initialized);
    } catch (err) {
      console.error('[SecureStorageContext] checkInitialized error:', err);
      setError(err as Error);
      setIsInitialized(false);
    }
  }, []);

  useEffect(() => {
    checkInitialized();
  }, [checkInitialized]);

  const initialize = useCallback(async (password: string) => {
    try {
      console.log('[SecureStorageContext] Initializing...');
      setError(null);
      await secureStorage.initialize(password);
      setIsUnlocked(true);
      setIsInitialized(true);
      console.log('[SecureStorageContext] Initialize complete - isUnlocked: true, isInitialized: true');
    } catch (err) {
      console.error('[SecureStorageContext] Initialize error:', err);
      setError(err as Error);
      throw err;
    }
  }, []);

  const unlock = useCallback(async (password: string): Promise<boolean> => {
    try {
      console.log('[SecureStorageContext] Unlocking...');
      setError(null);
      const success = await secureStorage.unlock(password);
      setIsUnlocked(success);
      console.log('[SecureStorageContext] Unlock result:', success);
      return success;
    } catch (err) {
      console.error('[SecureStorageContext] Unlock error:', err);
      setError(err as Error);
      return false;
    }
  }, []);

  const lock = useCallback(() => {
    console.log('[SecureStorageContext] Locking...');
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

  const reset = useCallback(async () => {
    try {
      console.log('[SecureStorageContext] Resetting storage...');
      setError(null);
      await secureStorage.reset();
      setIsUnlocked(false);
      setIsInitialized(false);
      console.log('[SecureStorageContext] Reset complete - isInitialized set to false');
      
      // Recheck after a short delay to ensure state is updated
      setTimeout(() => {
        checkInitialized();
      }, 100);
    } catch (err) {
      console.error('[SecureStorageContext] Reset error:', err);
      setError(err as Error);
      throw err;
    }
  }, [checkInitialized]);

  return (
    <SecureStorageContext.Provider
      value={{
        isUnlocked,
        isInitialized,
        initialize,
        unlock,
        lock,
        saveItem,
        getItem,
        removeItem,
        reset,
        error,
      }}
    >
      {children}
    </SecureStorageContext.Provider>
  );
}

export function useSecureStorage() {
  const context = useContext(SecureStorageContext);
  if (context === undefined) {
    throw new Error('useSecureStorage must be used within a SecureStorageProvider');
  }
  return context;
}
