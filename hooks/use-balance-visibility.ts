import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useState } from 'react';

const BALANCE_VISIBILITY_KEY = 'balance_visibility';

export interface UseBalanceVisibilityReturn {
  /**
   * Current visibility state of the balance
   */
  isVisible: boolean;
  /**
   * Toggle balance visibility
   */
  toggleVisibility: () => void;
  /**
   * Loading state while fetching initial preference
   */
  isLoading: boolean;
}

/**
 * Hook for managing balance visibility state
 * 
 * Manages show/hide state with AsyncStorage persistence.
 * Loads saved preference on mount and persists changes.
 * 
 * @returns {UseBalanceVisibilityReturn} Balance visibility state and controls
 * 
 * @example
 * ```tsx
 * const { isVisible, toggleVisibility, isLoading } = useBalanceVisibility();
 * 
 * if (isLoading) return <ActivityIndicator />;
 * 
 * return (
 *   <TouchableOpacity onPress={toggleVisibility}>
 *     <Text>{isVisible ? balance : '••••••'}</Text>
 *   </TouchableOpacity>
 * );
 * ```
 */
export function useBalanceVisibility(): UseBalanceVisibilityReturn {
  const [isVisible, setIsVisible] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  /**
   * Load saved visibility preference from storage
   */
  useEffect(() => {
    const loadVisibilityPreference = async () => {
      try {
        const savedValue = await AsyncStorage.getItem(BALANCE_VISIBILITY_KEY);
        if (savedValue !== null) {
          setIsVisible(savedValue === 'true');
        }
      } catch (error) {
        console.error('[useBalanceVisibility] Failed to load preference:', error);
        // Keep default value (true) on error
      } finally {
        setIsLoading(false);
      }
    };

    loadVisibilityPreference();
  }, []);

  /**
   * Toggle visibility and persist to storage
   */
  const toggleVisibility = useCallback(async () => {
    let newValue: boolean;
    try {
      // Use functional state update to avoid dependency on isVisible
      setIsVisible((prev) => {
        newValue = !prev;
        return newValue;
      });
      await AsyncStorage.setItem(BALANCE_VISIBILITY_KEY, String(newValue));
    } catch (error) {
      console.error('[useBalanceVisibility] Failed to save preference:', error);
      // Revert to previous value on error
      setIsVisible((prev) => !prev);
    }
  }, []);

  return {
    isVisible,
    toggleVisibility,
    isLoading,
  };
}
