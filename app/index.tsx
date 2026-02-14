/**
 * Root Index Screen - Entry Point
 * 
 * Checks authentication status and redirects to appropriate screen:
 * - No password → setup-password
 * - Password exists but locked → login
 * - Unlocked but no wallet → welcome
 * - Unlocked with wallet → (tabs)/home
 */

import { router } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { secureStorage } from '@/services/storage/secure-storage';

export default function IndexScreen() {
  useEffect(() => {
    checkAuthAndRedirect();
  }, []);

  const checkAuthAndRedirect = async () => {
    try {
      console.log('[IndexScreen] Checking auth status...');
      
      // Check if password is set up
      const salt = await SecureStore.getItemAsync('encryption_salt');
      console.log('[IndexScreen] Salt exists:', !!salt);
      
      if (!salt) {
        // First time - setup password
        console.log('[IndexScreen] No salt found, redirecting to setup-password');
        router.replace('/setup-password');
        return;
      }
      
      if (!secureStorage.isUnlocked()) {
        // Password exists but locked - login
        console.log('[IndexScreen] Salt exists but locked, redirecting to login');
        router.replace('/login');
        return;
      }
      
      // Already unlocked - check if wallet is set up
      console.log('[IndexScreen] Already unlocked, checking wallet status');
      const hasSeedPhrase = await secureStorage.getItem('wallet_seed_phrase');
      
      if (hasSeedPhrase) {
        console.log('[IndexScreen] Wallet exists, redirecting to home');
        router.replace('/(tabs)/home');
      } else {
        console.log('[IndexScreen] No wallet found, redirecting to welcome');
        router.replace('/welcome');
      }
      
    } catch (error) {
      console.error('[IndexScreen] Auth check failed:', error);
      // On error, redirect to setup to be safe
      router.replace('/setup-password');
    }
  };

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#007AFF" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});
