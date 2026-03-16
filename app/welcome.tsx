import { pinScreenStyles } from '@/app/pin-screen.styles'
import { PinScreenBackground } from '@/components/ui/PinScreenBackground'
import { Button, DashLogo, Heading, Text } from 'dash-ui-kit/react-native'
import { router } from 'expo-router'
import { Image, StyleSheet, View } from 'react-native'

export default function WelcomeScreen() {
  const handleCreateWallet = () => {
    router.push('/setup-password')
  }

  const handleImportWallet = () => {
    router.push('/import-seed-phrase')
  }

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
          Welcome to{' '}
          <Heading level={1} weight="extrabold" style={pinScreenStyles.title}>
            Dash{'\n'}Platform Extension
          </Heading>
        </Heading>

        <Text variant="body" weight="regular" opacity={60} style={styles.subtitle}>
          Enjoy all the benefits of Dash Platform in your browser
        </Text>
      </View>

      <View style={styles.authBlock}>
        <Button
          variant="outline"
          colorScheme="brand"
          size="xl"
          onPress={handleCreateWallet}
        >
          Create Wallet
        </Button>

        <Button
          variant="solid"
          colorScheme="brand"
          size="xl"
          onPress={handleImportWallet}
        >
          Import Wallet
        </Button>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  subtitle: {
    fontSize: 14,
    lineHeight: 17,
    color: 'rgba(12, 28, 51, 0.5)',
    maxWidth: 320,
  },
  authBlock: {
    gap: 12,
    marginTop: 'auto',
    paddingHorizontal: 20,
    paddingBottom: 47,
  },
})
