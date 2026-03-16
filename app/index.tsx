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
import { useCallback } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { useAuthGuard } from '@/hooks/use-auth-guard';

export default function IndexScreen() {
  const handleAuthenticated = useCallback(() => {
    console.log('[IndexScreen] Wallet exists, redirecting to home');
    router.replace('/(tabs)/home');
  }, []);

  useAuthGuard({ onAuthenticated: handleAuthenticated });

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
