import { PinScreenBackground } from '@/components/ui/PinScreenBackground'
import { pinScreenStyles } from '@/app/pin-screen.styles'
import { useSecureStorage } from '@/contexts/SecureStorageContext'
import { Button, DashLogo, Heading, Input, Text } from 'dash-ui-kit/react-native'
import { router } from 'expo-router'
import { useState } from 'react'
import { Alert, Image, Pressable, ScrollView, StyleSheet, View } from 'react-native'
import Svg, { Path } from 'react-native-svg'

type WordCount = 12 | 24

export default function ImportSeedPhraseScreen() {
  const [wordCount, setWordCount] = useState<WordCount>(12)
  const [words, setWords] = useState<string[]>(Array(12).fill(''))
  const [loading, setLoading] = useState(false)
  const { saveItem, error } = useSecureStorage()

  const handleWordCountChange = (count: WordCount) => {
    setWordCount(count)
    setWords(Array(count).fill(''))
  }

  const handleWordChange = (index: number, value: string) => {
    // Check if the value contains multiple words (pasted full phrase)
    const trimmedValue = value.trim()
    
    if (trimmedValue.includes(' ')) {
      // Split by spaces and filter out empty strings
      const pastedWords = trimmedValue
        .split(/\s+/)
        .filter(w => w.length > 0)
        .map(w => w.toLowerCase())
      
      // Auto-switch word count if needed
      if (pastedWords.length >= 24 && wordCount === 12) {
        // Switch to 24 words
        setWordCount(24)
        setWords(pastedWords.slice(0, 24))
      } else if (pastedWords.length >= 12 && pastedWords.length < 24 && wordCount === 24) {
        // Switch to 12 words if 12-23 words pasted
        setWordCount(12)
        setWords(pastedWords.slice(0, 12))
      } else if (pastedWords.length >= wordCount) {
        // Take exactly the number we need
        const newWords = pastedWords.slice(0, wordCount)
        setWords(newWords)
      } else {
        // If less than required, fill from current position
        const newWords = [...words]
        pastedWords.forEach((word, i) => {
          if (index + i < wordCount) {
            newWords[index + i] = word
          }
        })
        setWords(newWords)
      }
    } else {
      // Single word input
      const newWords = [...words]
      newWords[index] = trimmedValue.toLowerCase()
      setWords(newWords)
    }
  }

  const handleImport = async () => {
    // Validate all words are filled
    const emptyWords = words.filter(w => !w)
    if (emptyWords.length > 0) {
      Alert.alert('Error', 'Please fill in all words')
      return
    }

    try {
      setLoading(true)
      const seedPhrase = words.join(' ')
      
      // Save encrypted seed phrase
      await saveItem('wallet_seed_phrase', seedPhrase)
      
      Alert.alert('Success', 'Seed phrase imported successfully!')
      router.replace('/(tabs)/home')
    } catch (err) {
      console.error('Import failed:', err)
      Alert.alert('Error', error?.message || 'Failed to import seed phrase')
    } finally {
      setLoading(false)
    }
  }

  const handleBack = () => {
    router.back()
  }

  return (
    <View style={styles.outerContainer}>
      <PinScreenBackground />

      <View style={pinScreenStyles.topImageSection}>
        <Image
          source={require('@/assets/images/bars.png')}
          style={pinScreenStyles.barsImage}
          resizeMode="cover"
        />
      </View>

      {/* Navigation Bar — absolute over the decorative area */}
      <View style={styles.navBar}>
        <Pressable onPress={handleBack} style={styles.backButton}>
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
          </View>
        </View>
      </View>

      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Header */}
      <View style={styles.header}>
        <DashLogo />

        <Heading level={1} weight="extrabold" style={styles.title}>
          Import your Seed{'\n'}Phrase
        </Heading>

        <Text variant="body" weight="medium" opacity={50} style={styles.subtitle}>
          Paste your DashPay seed phrase from mobile wallet or Dash Evo tool
        </Text>
      </View>

      {/* Word Count Selector */}
      <View style={styles.wordCountSelector}>
        <Pressable
          style={[
            styles.wordCountButton,
            wordCount === 12 && styles.wordCountButtonActive,
          ]}
          onPress={() => handleWordCountChange(12)}
        >
          <Text
            variant="body"
            weight="medium"
            style={[
              styles.wordCountText,
              wordCount === 12 && styles.wordCountTextActive,
            ]}
          >
            12 Word
          </Text>
        </Pressable>

        <Pressable
          style={[
            styles.wordCountButton,
            wordCount === 24 && styles.wordCountButtonActive,
          ]}
          onPress={() => handleWordCountChange(24)}
        >
          <Text
            variant="body"
            weight="medium"
            style={[
              styles.wordCountText,
              wordCount === 24 && styles.wordCountTextActive,
            ]}
          >
            24 Word
          </Text>
        </Pressable>
      </View>

      {/* Seed Phrase Grid */}
      <View style={styles.phraseContainer}>
        {Array.from({ length: Math.ceil(wordCount / 3) }, (_, rowIndex) => (
          <View key={rowIndex} style={styles.phraseRow}>
            {Array.from({ length: 3 }, (_, colIndex) => {
              const index = rowIndex * 3 + colIndex
              if (index >= wordCount) return null

              return (
                <View key={index} style={styles.wordInputContainer}>
                  <Input
                    placeholder={`${index + 1}.`}
                    value={words[index]}
                    onChangeText={(text) => handleWordChange(index, text)}
                    autoCapitalize="none"
                    autoCorrect={false}
                    size="sm"
                    variant="outlined"
                    style={styles.wordInput}
                    textStyle={styles.wordInputText}
                  />
                </View>
              )
            })}
          </View>
        ))}
      </View>

      {/* Import Button */}
      <View style={styles.buttonContainer}>
        <Button
          variant="outline"
          colorScheme="brand"
          size="xl"
          onPress={handleImport}
          disabled={loading}
          loading={loading}
          style={styles.importButton}
        >
          <Text weight="medium" style={styles.importButtonText}>
            Import Identity
          </Text>
        </Button>
      </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  contentContainer: {
    paddingTop: 200,
    paddingHorizontal: 20,
    paddingBottom: 47,
  },
  navBar: {
    position: 'absolute',
    top: 50,
    left: 20,
    right: 20,
    zIndex: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
    gap: 4,
  },
  networkText: {
    fontSize: 14,
    lineHeight: 17,
    color: '#0C1C33',
  },
  header: {
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
  wordCountSelector: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 8,
    gap: 8,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 75,
    elevation: 5,
  },
  wordCountButton: {
    flex: 1,
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  wordCountButtonActive: {
    backgroundColor: '#4C7EFF',
  },
  wordCountText: {
    fontSize: 16,
    color: '#4C7EFF',
  },
  wordCountTextActive: {
    color: '#FFFFFF',
  },
  phraseContainer: {
    gap: 10,
    marginBottom: 30,
  },
  phraseRow: {
    flexDirection: 'row',
    gap: 10,
  },
  wordInputContainer: {
    flex: 1,
  },
  wordInput: {
    borderRadius: 15,
    borderColor: 'rgba(12, 28, 51, 0.35)',
    borderWidth: 1,
    backgroundColor: 'transparent',
    paddingHorizontal: 15,
    paddingVertical: 10,
    minHeight: 43,
  },
  wordInputText: {
    fontSize: 14,
    lineHeight: 23,
    color: 'rgba(12, 28, 51, 0.35)',
  },
  buttonContainer: {
    marginTop: 10,
  },
  importButton: {
    backgroundColor: 'rgba(76, 126, 255, 0.15)',
    borderWidth: 0,
    borderRadius: 15,
    paddingVertical: 12,
    paddingHorizontal: 24,
    height: 58,
  },
  importButtonText: {
    fontSize: 16,
    color: '#4C7EFF',
  },
})
