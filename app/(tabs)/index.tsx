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
      // Check if password is set up
      const salt = await SecureStore.getItemAsync('encryption_salt');
      
      if (!salt) {
        // First time - setup password
        router.replace('/setup-password');
      } else if (!secureStorage.isUnlocked()) {
        // Password exists but locked - login
        router.replace('/login');
      } else {
        // Already unlocked - go to wallet
        router.replace('/wallet');
      }
    } catch (error) {
      console.error('Auth check failed:', error);
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
