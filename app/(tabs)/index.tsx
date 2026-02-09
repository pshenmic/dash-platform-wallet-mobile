import { useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { secureStorage } from '@/services/storage/secure-storage';

export default function HomeScreen() {
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      console.log('[HomeScreen] Checking auth status...');
      
      // Check if password is set up
      const salt = await SecureStore.getItemAsync('encryption_salt');
      console.log('[HomeScreen] Salt exists:', !!salt);
      
      if (!salt) {
        // First time - setup password
        console.log('[HomeScreen] No salt found, redirecting to setup-password');
        router.replace('/setup-password');
      } else if (!secureStorage.isUnlocked()) {
        // Password exists but locked - login
        console.log('[HomeScreen] Salt exists but locked, redirecting to login');
        router.replace('/login');
      } else {
        // Already unlocked - check if wallet is set up
        console.log('[HomeScreen] Already unlocked, checking wallet status');
        const hasSeedPhrase = await secureStorage.getItem('wallet_seed_phrase');
        
        if (hasSeedPhrase) {
          console.log('[HomeScreen] Wallet exists, redirecting to wallet');
          router.replace('/wallet');
        } else {
          console.log('[HomeScreen] No wallet found, redirecting to welcome');
          router.replace('/welcome');
        }
      }
    } catch (error) {
      console.error('[HomeScreen] Auth check failed:', error);
      router.replace('/setup-password');
    }
  };

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#007AFF" />
      <Text style={styles.text}>Loading...</Text>
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
  text: {
    marginTop: 20,
    fontSize: 16,
    color: '#666',
  },
});
