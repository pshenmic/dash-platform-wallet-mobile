/**
 * Hook for biometric authentication (FaceID/TouchID)
 * 
 * Manages biometric authentication availability and execution
 */

import * as LocalAuthentication from 'expo-local-authentication';
import * as SecureStore from 'expo-secure-store';
import { useState, useEffect, useCallback } from 'react';

interface UseBiometricAuthReturn {
  isAvailable: boolean;
  biometricType: string | null;
  authenticate: () => Promise<boolean>;
  isEnrolled: boolean;
  saveBiometricPassword: (password: string) => Promise<void>;
  getBiometricPassword: () => Promise<string | null>;
  clearBiometricPassword: () => Promise<void>;
  hasSavedPassword: boolean;
}

const BIOMETRIC_PASSWORD_KEY = 'biometric_password';

export function useBiometricAuth(): UseBiometricAuthReturn {
  const [isAvailable, setIsAvailable] = useState(false);
  const [biometricType, setBiometricType] = useState<string | null>(null);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [hasSavedPassword, setHasSavedPassword] = useState(false);

  useEffect(() => {
    checkBiometricAvailability();
    checkSavedPassword();
  }, []);

  const checkBiometricAvailability = async () => {
    try {
      const compatible = await LocalAuthentication.hasHardwareAsync();
      setIsAvailable(compatible);

      if (compatible) {
        const enrolled = await LocalAuthentication.isEnrolledAsync();
        setIsEnrolled(enrolled);

        const types = await LocalAuthentication.supportedAuthenticationTypesAsync();
        if (types.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION)) {
          setBiometricType('Face ID');
        } else if (types.includes(LocalAuthentication.AuthenticationType.FINGERPRINT)) {
          setBiometricType('Touch ID');
        } else if (types.includes(LocalAuthentication.AuthenticationType.IRIS)) {
          setBiometricType('Iris');
        } else {
          setBiometricType('Biometric');
        }
      }
    } catch (error) {
      console.error('Error checking biometric availability:', error);
      setIsAvailable(false);
    }
  };

  const checkSavedPassword = async () => {
    try {
      const savedPassword = await SecureStore.getItemAsync(BIOMETRIC_PASSWORD_KEY);
      setHasSavedPassword(!!savedPassword);
    } catch (error) {
      console.error('Error checking saved password:', error);
      setHasSavedPassword(false);
    }
  };

  const authenticate = useCallback(async (): Promise<boolean> => {
    try {
      // In dev mode without biometric hardware, simulate success
      if (__DEV__ && !isAvailable) {
        console.log('DEV MODE: Biometric auth simulated as success');
        return true;
      }

      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Unlock your wallet',
        cancelLabel: 'Cancel',
        disableDeviceFallback: false,
        fallbackLabel: 'Use password',
      });

      return result.success;
    } catch (error) {
      console.error('Biometric authentication error:', error);
      return false;
    }
  }, [isAvailable]);

  const saveBiometricPassword = useCallback(async (password: string): Promise<void> => {
    try {
      await SecureStore.setItemAsync(BIOMETRIC_PASSWORD_KEY, password, {
        requireAuthentication: true,
      });
      setHasSavedPassword(true);
    } catch (error) {
      console.error('Error saving biometric password:', error);
      throw error;
    }
  }, []);

  const getBiometricPassword = useCallback(async (): Promise<string | null> => {
    try {
      return await SecureStore.getItemAsync(BIOMETRIC_PASSWORD_KEY);
    } catch (error) {
      console.error('Error getting biometric password:', error);
      return null;
    }
  }, []);

  const clearBiometricPassword = useCallback(async (): Promise<void> => {
    try {
      await SecureStore.deleteItemAsync(BIOMETRIC_PASSWORD_KEY);
      setHasSavedPassword(false);
    } catch (error) {
      console.error('Error clearing biometric password:', error);
      throw error;
    }
  }, []);

  return {
    isAvailable,
    biometricType,
    authenticate,
    isEnrolled,
    saveBiometricPassword,
    getBiometricPassword,
    clearBiometricPassword,
    hasSavedPassword,
  };
}
