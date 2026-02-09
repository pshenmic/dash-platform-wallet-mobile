import { Button, DashLogo, Heading, Text } from 'dash-ui-kit/react-native'
import { router } from 'expo-router'
import { useState } from 'react'
import { Alert, Pressable, StyleSheet, View } from 'react-native'
import Svg, { Path } from 'react-native-svg'

type WalletType = 'seed-phrase' | 'private-key' | null

export default function ImportWalletTypeScreen() {
  const [selectedType, setSelectedType] = useState<WalletType>(null)

  const handleNext = () => {
    if (!selectedType) return
    
    if (selectedType === 'seed-phrase') {
      router.push('/import-seed-phrase')
    } else {
      // TODO: Navigate to private key import screen
      Alert.alert('Coming Soon', 'Private key import will be available in a future update')
    }
  }

  const handleMenuPress = () => {
    router.back()
  }

  return (
    <View style={styles.container}>
      {/* Navigation Bar */}
      <View style={styles.navBar}>
        <Pressable onPress={handleMenuPress} style={styles.backButton}>
          <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <Path
              d="M15 18L9 12L15 6"
              stroke="#0C1C33"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Svg>
        </Pressable>

        <View style={styles.networkSelector}>
          <View style={styles.networkContent}>
            <Svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <Path
                d="M8 0C3.58 0 0 3.58 0 8C0 12.42 3.58 16 8 16C12.42 16 16 12.42 16 8C16 3.58 12.42 0 8 0ZM8 14.4C4.47 14.4 1.6 11.53 1.6 8C1.6 4.47 4.47 1.6 8 1.6C11.53 1.6 14.4 4.47 14.4 8C14.4 11.53 11.53 14.4 8 14.4Z"
                fill="white"
              />
              <Path
                d="M8 2.4C5.13 2.4 2.8 4.73 2.8 7.6H4.4C4.4 5.62 6.02 4 8 4C9.98 4 11.6 5.62 11.6 7.6H13.2C13.2 4.73 10.87 2.4 8 2.4Z"
                fill="white"
              />
            </Svg>
            <Text variant="body" weight="medium" style={styles.networkText}>
              mainnet
            </Text>
            <Svg width="9" height="5" viewBox="0 0 9 5" fill="none" style={styles.chevron}>
              <Path
                d="M1 1L4.5 4L8 1"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
          </View>
        </View>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <DashLogo />

        <Heading level={1} weight="extrabold" style={styles.title}>
          Choose Wallet Type
        </Heading>

        <Text variant="body" weight="medium" opacity={50} style={styles.subtitle}>
          You can create your wallet using these options, more options will come in future updates.
        </Text>
      </View>

      {/* Wallet Type Options */}
      <View style={styles.optionsContainer}>
        {/* Seed Phrase Option */}
        <Pressable
          style={[
            styles.optionButton,
            selectedType === 'seed-phrase' && styles.optionButtonSelected,
          ]}
          onPress={() => setSelectedType('seed-phrase')}
        >
          <View style={styles.optionIcon}>
            <Svg width="34" height="34" viewBox="0 0 34 34" fill="none">
              <Path
                d="M17 0C7.62 0 0 7.62 0 17C0 26.38 7.62 34 17 34C26.38 34 34 26.38 34 17C34 7.62 26.38 0 17 0ZM17 30.6C9.51 30.6 3.4 24.49 3.4 17C3.4 9.51 9.51 3.4 17 3.4C24.49 3.4 30.6 9.51 30.6 17C30.6 24.49 24.49 30.6 17 30.6Z"
                fill={selectedType === 'seed-phrase' ? '#4C7EFF' : 'rgba(12, 28, 51, 0.15)'}
              />
              {selectedType === 'seed-phrase' && (
                <Path
                  d="M13.6 21.25L9.35 17L7.65 18.7L13.6 24.65L26.35 11.9L24.65 10.2L13.6 21.25Z"
                  fill="#4C7EFF"
                />
              )}
            </Svg>
          </View>
          <View style={styles.optionContent}>
            <Text variant="body" weight="medium" style={styles.optionTitle}>
              Create <Text weight="extrabold">Seed Phrase</Text>
            </Text>
            <Text variant="caption" weight="medium" opacity={50} style={styles.optionDescription}>
              Seed Phrase is a row of random words that include encrypted information about your wallet.
            </Text>
          </View>
        </Pressable>

        {/* Private Key Option */}
        <Pressable
          style={[
            styles.optionButton,
            selectedType === 'private-key' && styles.optionButtonSelected,
          ]}
          onPress={() => setSelectedType('private-key')}
        >
          <View style={styles.optionIcon}>
            <Svg width="34" height="34" viewBox="0 0 34 34" fill="none">
              <Path
                d="M17 0C7.62 0 0 7.62 0 17C0 26.38 7.62 34 17 34C26.38 34 34 26.38 34 17C34 7.62 26.38 0 17 0ZM17 30.6C9.51 30.6 3.4 24.49 3.4 17C3.4 9.51 9.51 3.4 17 3.4C24.49 3.4 30.6 9.51 30.6 17C30.6 24.49 24.49 30.6 17 30.6Z"
                fill={selectedType === 'private-key' ? '#4C7EFF' : 'rgba(12, 28, 51, 0.15)'}
              />
              {selectedType === 'private-key' && (
                <Path
                  d="M13.6 21.25L9.35 17L7.65 18.7L13.6 24.65L26.35 11.9L24.65 10.2L13.6 21.25Z"
                  fill="#4C7EFF"
                />
              )}
            </Svg>
          </View>
          <View style={styles.optionContent}>
            <Text variant="body" weight="medium" style={styles.optionTitle}>
              Create <Text weight="extrabold">Private Key</Text>
            </Text>
            <Text variant="caption" weight="medium" opacity={50} style={styles.optionDescription}>
              Private Key is a unique string of characters that allows access to your wallet.
            </Text>
          </View>
        </Pressable>
      </View>

      {/* Next Button */}
      <View style={styles.buttonContainer}>
        <Button
          variant="outline"
          colorScheme="brand"
          size="xl"
          onPress={handleNext}
          disabled={!selectedType}
          style={styles.nextButton}
        >
          <Text weight="medium" style={styles.nextButtonText}>
            Next
          </Text>
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
    marginBottom: 40,
  },
  backButton: {
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
  content: {
    alignItems: 'flex-start',
    gap: 10,
    marginBottom: 30,
  },
  title: {
    fontSize: 40,
    lineHeight: 50,
    letterSpacing: -1.2,
    color: '#0C1C33',
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 17,
    color: 'rgba(12, 28, 51, 0.5)',
  },
  optionsContainer: {
    gap: 8,
    marginBottom: 'auto',
  },
  optionButton: {
    backgroundColor: 'rgba(12, 28, 51, 0.03)',
    borderRadius: 15,
    paddingVertical: 12,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  optionButtonSelected: {
    backgroundColor: 'rgba(76, 126, 255, 0.08)',
  },
  optionIcon: {
    width: 34,
    height: 34,
  },
  optionContent: {
    flex: 1,
    gap: 4,
  },
  optionTitle: {
    fontSize: 16,
    lineHeight: 19,
    color: '#0C1C33',
  },
  optionDescription: {
    fontSize: 12,
    lineHeight: 14,
    color: 'rgba(12, 28, 51, 0.5)',
  },
  buttonContainer: {
    marginTop: 20,
  },
  nextButton: {
    backgroundColor: 'rgba(76, 126, 255, 0.15)',
    borderWidth: 0,
    borderRadius: 15,
    paddingVertical: 12,
    paddingHorizontal: 24,
    height: 58,
  },
  nextButtonText: {
    fontSize: 16,
    color: '#4C7EFF',
  },
})
