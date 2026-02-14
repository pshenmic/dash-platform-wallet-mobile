import { useSecureStorage } from '@/contexts/SecureStorageContext'
import { useBiometricAuth } from '@/hooks/use-biometric-auth'
import { Button, DashLogo, Heading, Input, Text } from 'dash-ui-kit/react-native'
import { router } from 'expo-router'
import { useCallback, useEffect, useState } from 'react'
import { Alert, Pressable, StyleSheet, View } from 'react-native'
import Svg, { Path } from 'react-native-svg'

export default function LoginScreen() {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { unlock, reset, isInitialized, error } = useSecureStorage();
  const {
    isAvailable,
    biometricType,
    authenticate,
    isEnrolled,
    saveBiometricPassword,
    getBiometricPassword,
    clearBiometricPassword,
    hasSavedPassword,
  } = useBiometricAuth();

  // Redirect to setup if storage not initialized
  useEffect(() => {
    console.log('[LoginScreen] isInitialized:', isInitialized);
    if (isInitialized === false) {
      console.log('[LoginScreen] Redirecting to setup-password');
      router.replace('/setup-password');
    }
  }, [isInitialized]);

  const handleBiometricLogin = useCallback(async () => {
    try {
      setLoading(true);
      const authSuccess = await authenticate();

      if (authSuccess) {
        const savedPassword = await getBiometricPassword();
        
        if (savedPassword) {
          const unlockSuccess = await unlock(savedPassword);

          if (unlockSuccess) {
            // Check if wallet is set up (has seed phrase)
            const { secureStorage } = await import('@/services/storage/secure-storage');
            const hasSeedPhrase = await secureStorage.getItem('wallet_seed_phrase');
            
            if (hasSeedPhrase) {
              router.replace('/(tabs)/home');
            } else {
              router.replace('/welcome');
            }
          } else {
            Alert.alert('Error', 'Failed to unlock wallet');
          }
        } else {
          Alert.alert('Error', 'No saved password found');
        }
      }
    } catch (err) {
      console.error('Biometric login error:', err);
    } finally {
      setLoading(false);
    }
  }, [authenticate, getBiometricPassword, unlock]);

  // Auto-trigger biometric authentication on mount if available
  useEffect(() => {
    if (isAvailable && isEnrolled && hasSavedPassword) {
      handleBiometricLogin();
    }
  }, [isAvailable, isEnrolled, hasSavedPassword, handleBiometricLogin]);

  const handleLogin = async () => {
    if (!password) {
      Alert.alert('Error', 'Please enter password');
      return;
    }

    // Check if storage is initialized before attempting login
    if (isInitialized === false) {
      console.log('[LoginScreen] Storage not initialized, redirecting to setup');
      Alert.alert('Not Initialized', 'Please set up a password first');
      router.replace('/setup-password');
      return;
    }

    try {
      setLoading(true);
      console.log('[LoginScreen] Attempting unlock...');
      const success = await unlock(password);
      console.log('[LoginScreen] Unlock result:', success);

      if (success) {
        // Save password for biometric auth if available and not saved yet
        if (isAvailable && isEnrolled && !hasSavedPassword) {
          try {
            await saveBiometricPassword(password);
          } catch (err) {
            console.error('Failed to save password for biometric auth:', err);
          }
        }
        
        // Check if wallet is set up (has seed phrase)
        const { secureStorage } = await import('@/services/storage/secure-storage');
        const hasSeedPhrase = await secureStorage.getItem('wallet_seed_phrase');
        
        if (hasSeedPhrase) {
          router.replace('/(tabs)/home');
        } else {
          router.replace('/welcome');
        }
      } else {
        Alert.alert('Error', error?.message || 'Wrong password');
        setPassword('');
      }
    } catch (err) {
      console.error('[LoginScreen] Login error:', err);
      Alert.alert('Error', error?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = () => {
    Alert.alert(
      'Reset Password?',
      'This will delete all encrypted data and reset the app. You will need to set up a new password.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Reset', 
          style: 'destructive',
          onPress: async () => {
            try {
              console.log('[LoginScreen] Starting password reset...');
              await reset();
              await clearBiometricPassword();
              console.log('[LoginScreen] Reset complete, biometric cleared');
              Alert.alert('Success', 'Password reset. Redirecting...');
              // Will auto-redirect via useEffect when isInitialized becomes false
            } catch (err) {
              console.error('[LoginScreen] Reset error:', err);
              Alert.alert('Error', 'Failed to reset password');
            }
          }
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <DashLogo />
        
        <Heading 
          level={1}
          weight="semibold"
          style={styles.title}
        >
          Welcome Back
        </Heading>
        
        <Text 
          variant="body"
          weight="regular"
          opacity={60}
          style={styles.subtitle}
        >
          Use the password to unlock your wallet.
        </Text>
      </View>

      {/* Authorization Block */}
      <View style={styles.authBlock}>
        <View style={styles.inputSection}>
          <Text 
            variant="body"
            weight="regular"
            opacity={60}
            style={styles.inputLabel}
          >
            Password
          </Text>
          
          <Input
            placeholder="Type Your Password"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            autoCapitalize="none"
            autoFocus
            size="xl"
            variant="outlined"
            style={styles.input}
            textStyle={styles.inputText}
          />
        </View>

        <Button
          variant="solid"
          colorScheme="brand"
          size="xl"
          onPress={handleLogin}
          disabled={loading || !password}
          loading={loading}
          style={styles.button}
        >
          <Text weight="regular" style={styles.buttonText}>
            Unlock
          </Text>
        </Button>

        {/* Biometric Authentication Button */}
        {isAvailable && isEnrolled && (
          <Button
            variant="outline"
            colorScheme="brand"
            size="xl"
            onPress={handleBiometricLogin}
            disabled={loading}
            style={styles.biometricButton}
          >
            <View style={styles.biometricButtonContent}>
              <Svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <Path
                  d="M10 2C5.58 2 2 5.58 2 10C2 14.42 5.58 18 10 18C14.42 18 18 14.42 18 10C18 5.58 14.42 2 10 2ZM10 6C11.1 6 12 6.9 12 8C12 9.1 11.1 10 10 10C8.9 10 8 9.1 8 8C8 6.9 8.9 6 10 6ZM10 15.2C8 15.2 6.29 14.16 5.4 12.6C5.42 11 8.4 10.1 10 10.1C11.59 10.1 14.58 11 14.6 12.6C13.71 14.16 12 15.2 10 15.2Z"
                  fill="#4C7EFF"
                />
              </Svg>
              <Text weight="regular" style={styles.biometricButtonText}>
                Use {biometricType}
              </Text>
            </View>
          </Button>
        )}
      </View>

      {/* Other Actions */}
      <View style={styles.otherActions}>
        <Pressable style={styles.actionLink} onPress={() => Alert.alert('Register Wallet', 'Wallet registration flow')}>
          <Svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <Path
              d="M13.33 2.67H10C9.63 2.67 9.33 2.97 9.33 3.34C9.33 3.71 9.63 4.01 10 4.01H12.39L8 8.4L5.47 5.87C5.21 5.61 4.79 5.61 4.53 5.87L1.2 9.2C0.94 9.46 0.94 9.88 1.2 10.14C1.46 10.4 1.88 10.4 2.14 10.14L5 7.28L7.53 9.81C7.79 10.07 8.21 10.07 8.47 9.81L13.33 4.95V7.34C13.33 7.71 13.63 8.01 14 8.01C14.37 8.01 14.67 7.71 14.67 7.34V3.34C14.67 2.97 14.37 2.67 14 2.67H13.33Z"
              fill="rgba(12, 28, 51, 0.35)"
            />
          </Svg>
          <Text variant="caption" weight="regular" opacity={40} style={styles.actionText}>
            Register wallet
          </Text>
        </Pressable>

        <View style={styles.divider} />

        <Pressable onPress={handleResetPassword}>
          <Text variant="caption" weight="regular" opacity={40} style={styles.actionText}>
            Forgot password?
          </Text>
        </Pressable>
      </View>

      {/* DEV: Reset button */}
      {__DEV__ && (
        <View style={styles.devActions}>
          <Pressable 
            onPress={async () => {
              const SecureStore = await import('expo-secure-store');
              const salt = await SecureStore.getItemAsync('encryption_salt');
              const verification = await SecureStore.getItemAsync('password_verification');
              Alert.alert(
                'Storage State',
                `isInitialized: ${isInitialized}\n` +
                `salt exists: ${!!salt}\n` +
                `verification exists: ${!!verification}\n` +
                `error: ${error?.message || 'none'}`
              );
            }} 
            style={styles.devButtonInfo}
          >
            <Text variant="caption" weight="semibold" style={styles.devButtonInfoText}>
              [DEV] Check State
            </Text>
          </Pressable>
          
          <Pressable onPress={handleResetPassword} style={styles.devButton}>
            <Text variant="caption" weight="semibold" style={styles.devButtonText}>
              [DEV] Reset Password
            </Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F3F3',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'flex-start',
    marginBottom: 60,
  },
  iconContainer: {
    width: 48,
    height: 48,
    marginBottom: 10,
  },
  title: {
    fontSize: 40,
    lineHeight: 50,
    letterSpacing: -1.2,
    color: '#0C1C33',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 17,
    color: 'rgba(12, 28, 51, 0.5)',
  },
  authBlock: {
    gap: 15,
    paddingHorizontal: 10,
  },
  inputSection: {
    gap: 10,
  },
  inputLabel: {
    fontSize: 16,
    lineHeight: 19,
    color: 'rgba(12, 28, 51, 0.5)',
  },
  input: {
    borderRadius: 20,
    borderColor: 'rgba(12, 28, 51, 0.32)',
    borderWidth: 1,
    backgroundColor: 'transparent',
    paddingHorizontal: 25,
    paddingVertical: 20,
  },
  inputText: {
    fontSize: 14,
    color: 'rgba(12, 28, 51, 0.35)',
  },
  button: {
    backgroundColor: 'rgba(76, 126, 255, 0.15)',
    borderRadius: 15,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  buttonText: {
    fontSize: 16,
    color: '#4C7EFF',
  },
  biometricButton: {
    backgroundColor: 'transparent',
    borderColor: 'rgba(76, 126, 255, 0.32)',
    borderWidth: 1,
    borderRadius: 15,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  biometricButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  biometricButtonText: {
    fontSize: 16,
    color: '#4C7EFF',
  },
  otherActions: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 15,
    marginTop: 25,
  },
  actionLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  actionText: {
    fontSize: 12,
    lineHeight: 14,
    color: 'rgba(12, 28, 51, 0.35)',
  },
  divider: {
    width: 1,
    height: 16,
    backgroundColor: 'rgba(12, 28, 51, 0.25)',
  },
  devActions: {
    marginTop: 20,
    alignItems: 'center',
    gap: 10,
  },
  devButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: 'rgba(255, 59, 48, 0.1)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 59, 48, 0.3)',
  },
  devButtonText: {
    fontSize: 12,
    color: '#FF3B30',
  },
  devButtonInfo: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(0, 122, 255, 0.3)',
  },
  devButtonInfoText: {
    fontSize: 12,
    color: '#007AFF',
  },
});
