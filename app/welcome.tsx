import { Button, DashLogo, Heading, Text } from 'dash-ui-kit/react-native'
import { router } from 'expo-router'
import { StyleSheet, View } from 'react-native'

export default function WelcomeScreen() {
  const handleCreateWallet = () => {
    // TODO: Navigate to create wallet flow
    router.push('/setup-password')
  }

  const handleImportWallet = () => {
    // Navigate to wallet type selection screen
    router.push('/import-wallet-type')
  }

  const handleMenuPress = () => {
    console.log('Menu pressed')
  }

  return (
    <View style={styles.container}>

      {/* Content */}
      <View style={styles.content}>
        <DashLogo />

        <View style={styles.textContainer}>
          <Heading level={1} weight="semibold" style={styles.title}>
            Welcome to{' '}
            <Text variant="display" weight="extrabold" style={styles.titleBrand}>
              Dash{'\n'}Platform Extension
            </Text>
          </Heading>

          <Text variant="body" weight="medium" opacity={50} style={styles.subtitle}>
            Enjoy all the benefits of Dash Platform in your browser
          </Text>
        </View>
      </View>

      {/* Authorization Block */}
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
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingTop: 14,
    paddingHorizontal: 20,
    paddingBottom: 47,
  },
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  menuButton: {
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  networkSelector: {
    backgroundColor: 'rgba(12, 28, 51, 0.15)',
    borderColor: 'rgba(255, 255, 255, 0.15)',
    borderWidth: 1,
    borderRadius: 15,
    paddingHorizontal: 16,
    paddingVertical: 15,
    height: 48,
  },
  networkContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  networkText: {
    fontSize: 14,
    lineHeight: 17,
    color: '#FFFFFF',
  },
  chevron: {
    marginTop: 2,
  },
  decorativeImageContainer: {
    alignItems: 'center',
    marginTop: -100,
    marginBottom: 20,
    height: 200,
  },
  decorativePlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    gap: 10,
    marginBottom: 40,
  },
  textContainer: {
    alignItems: 'center',
    gap: 10,
  },
  title: {
    fontSize: 40,
    lineHeight: 50,
    letterSpacing: -1.2,
    color: '#0C1C33',
    textAlign: 'center',
  },
  titleBrand: {
    fontSize: 40,
    lineHeight: 50,
    letterSpacing: -1.2,
    color: '#0C1C33',
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 17,
    color: 'rgba(12, 28, 51, 0.5)',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  authBlock: {
    gap: 12,
    marginTop: 'auto',
  },
})
