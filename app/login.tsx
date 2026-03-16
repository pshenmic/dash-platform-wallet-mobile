import { PIN_LENGTH, PinDots, PinKeypad } from '@/components/ui/PinKeypad'
import { PinScreenBackground } from '@/components/ui/PinScreenBackground'
import { useSecureStorage } from '@/contexts/SecureStorageContext'
import { useBiometricAuth } from '@/hooks/use-biometric-auth'
import { pinScreenStyles } from '@/app/pin-screen.styles'
import { DashLogo, Heading, Text } from 'dash-ui-kit/react-native'
import { router } from 'expo-router'
import { clearFailedAttempts, getLockoutDurationMs, getLockoutRemainingMs, incrementFailedAttempts, MAX_ATTEMPTS_BEFORE_LOCKOUT } from '@/services/auth/pin-lockout'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Alert, Image, Pressable, StyleSheet, View } from 'react-native'
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from 'react-native-reanimated'
import Svg, { Path } from 'react-native-svg'

const MAX_ATTEMPTS_BEFORE_WIPE = 10

export default function LoginScreen() {
  const [pin, setPin] = useState('')
  const [pinError, setPinError] = useState(false)
  const [loading, setLoading] = useState(false)
  const [lockoutSeconds, setLockoutSeconds] = useState(0)
  const lockoutTimer = useRef<ReturnType<typeof setInterval> | null>(null)
  const { unlock, reset, isInitialized, error } = useSecureStorage()
  const {
    isAvailable,
    authenticate,
    isEnrolled,
    saveBiometricPassword,
    getBiometricPassword,
    clearBiometricPassword,
    hasSavedPassword,
  } = useBiometricAuth()

  const shakeX = useSharedValue(0)

  const shakeStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shakeX.value }],
  }))

  const triggerShake = useCallback(() => {
    setPinError(true)
    shakeX.value = withSequence(
      withTiming(-10, { duration: 50 }),
      withTiming(10, { duration: 50 }),
      withTiming(-8, { duration: 50 }),
      withTiming(8, { duration: 50 }),
      withTiming(0, { duration: 50 }),
    )
    setTimeout(() => setPinError(false), 500)
  }, [shakeX])

  useEffect(() => {
    if (isInitialized === false) {
      router.replace('/setup-password')
    }
  }, [isInitialized])

  const startLockoutCountdown = useCallback((remainingMs: number) => {
    setLockoutSeconds(Math.ceil(remainingMs / 1000))
    lockoutTimer.current = setInterval(() => {
      setLockoutSeconds(prev => {
        if (prev <= 1) {
          if (lockoutTimer.current) clearInterval(lockoutTimer.current)
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }, [])

  useEffect(() => {
    getLockoutRemainingMs().then(ms => {
      if (ms > 0) startLockoutCountdown(ms)
    })
    return () => {
      if (lockoutTimer.current) clearInterval(lockoutTimer.current)
    }
  }, [startLockoutCountdown])

  const handleBiometricLogin = useCallback(async () => {
    try {
      setLoading(true)
      const authSuccess = await authenticate()

      if (authSuccess) {
        const savedPassword = await getBiometricPassword()

        if (savedPassword) {
          const unlockSuccess = await unlock(savedPassword)

          if (unlockSuccess) {
            await clearFailedAttempts()
            const { secureStorage } = await import('@/services/storage/secure-storage')
            const hasSeedPhrase = await secureStorage.getItem('wallet_seed_phrase')

            if (hasSeedPhrase) {
              router.replace('/(tabs)/home')
            } else {
              router.replace('/welcome')
            }
          } else {
            Alert.alert('Error', 'Failed to unlock wallet')
          }
        } else {
          Alert.alert('Error', 'No saved PIN found')
        }
      }
    } catch (err) {
      console.error('Biometric login error:', err)
    } finally {
      setLoading(false)
    }
  }, [authenticate, getBiometricPassword, unlock])

  useEffect(() => {
    if (isAvailable && isEnrolled && hasSavedPassword) {
      handleBiometricLogin()
    }
  }, [isAvailable, isEnrolled, hasSavedPassword, handleBiometricLogin])

  const handleLogin = useCallback(
    async (finalPin: string) => {
      if (isInitialized === false) {
        router.replace('/setup-password')
        return
      }

      const remainingMs = await getLockoutRemainingMs()
      if (remainingMs > 0) {
        Alert.alert('Too many attempts', `Try again in ${Math.ceil(remainingMs / 1000)}s`)
        setPin('')
        return
      }

      try {
        setLoading(true)
        const success = await unlock(finalPin)

        if (success) {
          await clearFailedAttempts()

          if (isAvailable && isEnrolled && !hasSavedPassword) {
            try {
              await saveBiometricPassword(finalPin)
            } catch (err) {
              console.error('Failed to save PIN for biometric auth:', err)
            }
          }

          const { secureStorage } = await import('@/services/storage/secure-storage')
          const hasSeedPhrase = await secureStorage.getItem('wallet_seed_phrase')

          if (hasSeedPhrase) {
            router.replace('/(tabs)/home')
          } else {
            router.replace('/welcome')
          }
        } else {
          const attempts = await incrementFailedAttempts()
          triggerShake()
          setTimeout(() => setPin(''), 500)

          if (attempts >= MAX_ATTEMPTS_BEFORE_WIPE) {
            Alert.alert(
              'Too many failed attempts',
              'Your wallet has been locked for security. Reset to set up a new PIN.',
              [{ text: 'Reset', style: 'destructive', onPress: async () => {
                await reset()
                await clearBiometricPassword()
                await clearFailedAttempts()
              }}],
            )
          } else if (attempts >= MAX_ATTEMPTS_BEFORE_LOCKOUT) {
            const lockMs = getLockoutDurationMs(attempts)
            startLockoutCountdown(lockMs)
            Alert.alert('Wrong PIN', `Too many attempts. Try again in ${Math.ceil(lockMs / 1000)}s`)
          } else {
            const remaining = MAX_ATTEMPTS_BEFORE_LOCKOUT - attempts
            Alert.alert('Wrong PIN', `${remaining} attempt${remaining === 1 ? '' : 's'} remaining before lockout`)
          }
        }
      } catch (err) {
        console.error('[LoginScreen] Login error:', err)
        Alert.alert('Error', (err as Error).message || 'Login failed')
        setPin('')
      } finally {
        setLoading(false)
      }
    },
    [isInitialized, unlock, isAvailable, isEnrolled, hasSavedPassword, saveBiometricPassword, reset, clearBiometricPassword, triggerShake, startLockoutCountdown],
  )

  const handleDigit = useCallback(
    (digit: string) => {
      if (loading || lockoutSeconds > 0 || pin.length >= PIN_LENGTH) return
      const next = pin + digit
      setPin(next)
      if (next.length === PIN_LENGTH) {
        handleLogin(next)
      }
    },
    [loading, lockoutSeconds, pin, handleLogin],
  )

  const handleDelete = useCallback(() => {
    if (loading || lockoutSeconds > 0) return
    setPin(prev => prev.slice(0, -1))
  }, [loading, lockoutSeconds])

  const handleResetPin = () => {
    Alert.alert(
      'Reset PIN?',
      'This will delete all encrypted data and reset the app. You will need to set up a new PIN.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: async () => {
            try {
              await reset()
              await clearBiometricPassword()
              await clearFailedAttempts()
              Alert.alert('Success', 'PIN reset. Redirecting...')
            } catch (err) {
              console.error('[LoginScreen] Reset error:', err)
              Alert.alert('Error', 'Failed to reset PIN')
            }
          },
        },
      ],
    )
  }

  const BiometricButton = isAvailable && isEnrolled ? (
    <Pressable onPress={handleBiometricLogin} disabled={loading} style={styles.biometricAction}>
      <Svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <Path
          d="M14 3C8.48 3 4 7.48 4 13C4 18.52 8.48 23 14 23C19.52 23 24 18.52 24 13C24 7.48 19.52 3 14 3ZM14 8C15.66 8 17 9.34 17 11C17 12.66 15.66 14 14 14C12.34 14 11 12.66 11 11C11 9.34 12.34 8 14 8ZM14 20.4C11.5 20.4 9.29 19.2 7.94 17.35C7.97 15.45 11.5 14.4 14 14.4C16.49 14.4 20.03 15.45 20.06 17.35C18.71 19.2 16.5 20.4 14 20.4Z"
          fill="rgba(12, 28, 51, 0.64)"
        />
      </Svg>
    </Pressable>
  ) : undefined

  return (
    <View style={pinScreenStyles.container}>
      <PinScreenBackground />

      <View style={pinScreenStyles.topImageSection}>
        <Image
          source={require('@/assets/images/bars.png')}
          style={pinScreenStyles.barsImage}
          resizeMode="cover"
        />
      </View>

      <View style={pinScreenStyles.header}>
        <DashLogo />

        <Heading level={1} weight="semibold" style={pinScreenStyles.title}>
          Welcome Back
        </Heading>

        <Text variant="body" weight="regular" opacity={60} style={pinScreenStyles.subtitle}>
          {lockoutSeconds > 0
            ? `Too many attempts. Try again in ${lockoutSeconds}s`
            : 'Enter your PIN to unlock your wallet.'}
        </Text>
      </View>

      <View style={pinScreenStyles.dotsContainer}>
        <Animated.View style={[shakeStyle, { width: '100%' }]}>
          <PinDots filled={pin.length} error={pinError} />
        </Animated.View>
      </View>

      <View style={pinScreenStyles.bottomSection}>
        <View style={styles.keypadContainer}>
          <PinKeypad
            onPress={handleDigit}
            onDelete={handleDelete}
            leftAction={BiometricButton}
            disabled={loading}
          />
        </View>

        <View style={styles.otherActions}>
          <Pressable onPress={() => Alert.alert('Register Wallet', 'Wallet registration flow')}>
            <Text variant="caption" weight="regular" opacity={40} style={styles.actionText}>
              Register wallet
            </Text>
          </Pressable>

          <View style={styles.divider} />

          <Pressable onPress={handleResetPin}>
            <Text variant="caption" weight="regular" opacity={40} style={styles.actionText}>
              Forgot PIN?
            </Text>
          </Pressable>
        </View>

        {__DEV__ && (
          <View style={styles.devActions}>
            <Pressable
              onPress={async () => {
                const SecureStore = await import('expo-secure-store')
                const salt = await SecureStore.getItemAsync('encryption_salt')
                const verification = await SecureStore.getItemAsync('password_verification')
                Alert.alert(
                  'Storage State',
                  `isInitialized: ${isInitialized}\n` +
                    `salt exists: ${!!salt}\n` +
                    `verification exists: ${!!verification}\n` +
                    `error: ${error?.message || 'none'}`,
                )
              }}
              style={styles.devButtonInfo}
            >
              <Text variant="caption" weight="semibold" style={styles.devButtonInfoText}>
                [DEV] Check State
              </Text>
            </Pressable>

            <Pressable onPress={handleResetPin} style={styles.devButton}>
              <Text variant="caption" weight="semibold" style={styles.devButtonText}>
                [DEV] Reset PIN
              </Text>
            </Pressable>
          </View>
        )}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  keypadContainer: {
    paddingBottom: 8,
  },
  biometricAction: {
    width: 131,
    height: 82,
    justifyContent: 'center',
    alignItems: 'center',
  },
  otherActions: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 15,
    marginTop: 16,
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
})
