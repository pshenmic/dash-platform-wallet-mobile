import { PIN_LENGTH, PinDots, PinKeypad } from '@/components/ui/PinKeypad'
import { PinScreenBackground } from '@/components/ui/PinScreenBackground'
import { useSecureStorage } from '@/contexts/SecureStorageContext'
import { pinScreenStyles } from '@/app/pin-screen.styles'
import { DashLogo, Heading, Text } from 'dash-ui-kit/react-native'
import { router } from 'expo-router'
import { useCallback, useRef, useState } from 'react'
import { Alert, Image, StyleSheet, View, type TextStyle } from 'react-native'
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from 'react-native-reanimated'

type Phase = 'enter' | 'confirm'

export default function SetupPasswordScreen() {
  const [phase, setPhase] = useState<Phase>('enter')
  const [pin, setPin] = useState('')
  const [confirmPin, setConfirmPin] = useState('')
  const [pinError, setPinError] = useState(false)
  const [loading, setLoading] = useState(false)
  const { initialize, error: storageError } = useSecureStorage()

  const shakeX = useSharedValue(0)
  const firstPin = useRef('')

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

  const handleSetup = useCallback(
    async (finalPin: string) => {
      try {
        setLoading(true)
        await initialize(finalPin)
        router.replace('/welcome')
      } catch (err) {
        console.error('[SetupPIN] Setup failed:', err)
        Alert.alert('Error', storageError?.message || 'Setup failed')
        setPhase('enter')
        setPin('')
        setConfirmPin('')
        firstPin.current = ''
      } finally {
        setLoading(false)
      }
    },
    [initialize, storageError],
  )

  const handleDigit = useCallback(
    (digit: string) => {
      if (loading) return

      if (phase === 'enter') {
        if (pin.length >= PIN_LENGTH) return
        const next = pin + digit
        setPin(next)
        if (next.length === PIN_LENGTH) {
          firstPin.current = next
          setTimeout(() => {
            setPhase('confirm')
          }, 200)
        }
      } else {
        if (confirmPin.length >= PIN_LENGTH) return
        const next = confirmPin + digit
        setConfirmPin(next)
        if (next.length === PIN_LENGTH) {
          if (next === firstPin.current) {
            handleSetup(next)
          } else {
            triggerShake()
            setTimeout(() => setConfirmPin(''), 500)
          }
        }
      }
    },
    [loading, phase, pin, confirmPin, handleSetup, triggerShake],
  )

  const handleDelete = useCallback(() => {
    if (loading) return
    if (phase === 'enter') {
      setPin(prev => prev.slice(0, -1))
    } else {
      setConfirmPin(prev => prev.slice(0, -1))
    }
  }, [loading, phase])

  const currentFilled = phase === 'enter' ? pin.length : confirmPin.length

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
          {phase === 'enter' ? 'Create Wallet' : 'Confirm PIN'}
        </Heading>

        <Text variant="body" weight="regular" opacity={60} style={StyleSheet.flatten([pinScreenStyles.subtitle, styles.subtitle]) as TextStyle}>
          {phase === 'enter'
            ? 'You will use this PIN to unlock your wallet. Do not share your PIN with others'
            : 'Re-enter your PIN to confirm'}
        </Text>
      </View>

      <View style={pinScreenStyles.dotsContainer}>
        <Animated.View style={[shakeStyle, { width: '100%' }]}>
          <PinDots filled={currentFilled} error={pinError} />
        </Animated.View>
      </View>

      <View style={pinScreenStyles.bottomSection}>
        <PinKeypad onPress={handleDigit} onDelete={handleDelete} disabled={loading} />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  subtitle: {
    maxWidth: 320,
  },
})
