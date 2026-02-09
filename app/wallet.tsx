import { useSecureStorage } from '@/contexts/SecureStorageContext';
import { Button, DashLogo, Heading, Text } from 'dash-ui-kit/react-native';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

export default function WalletScreen() {
  const [savedSeedPhrase, setSavedSeedPhrase] = useState<string | null>(null);
  const { isUnlocked, lock, getItem, removeItem } = useSecureStorage();

  useEffect(() => {
    console.log('[WalletScreen] isUnlocked changed:', isUnlocked);
    checkLock();
    checkAndLoadSeedPhrase();
  }, [isUnlocked]);

  const checkLock = () => {
    console.log('[WalletScreen] checkLock - isUnlocked:', isUnlocked);
    if (!isUnlocked) {
      console.log('[WalletScreen] Not unlocked, redirecting to login');
      Alert.alert('Locked', 'Please login first');
      router.replace('/login');
    }
  };

  const checkAndLoadSeedPhrase = async () => {
    if (!isUnlocked) return;
    
    try {
      const saved = await getItem('wallet_seed_phrase');
      setSavedSeedPhrase(saved);
    } catch (err) {
      console.error('Failed to load seed phrase:', err);
      
      // If decryption failed, data is corrupted - offer to clear it
      if (err instanceof Error && err.message.includes('Decryption failed')) {
        Alert.alert(
          'Corrupted Data',
          'Saved seed phrase is corrupted or encrypted with a different password. Clear it?',
          [
            { text: 'Cancel', style: 'cancel' },
            {
              text: 'Clear',
              style: 'destructive',
              onPress: async () => {
                try {
                  await removeItem('wallet_seed_phrase');
                  setSavedSeedPhrase(null);
                  Alert.alert('Cleared', 'Corrupted data removed');
                } catch (clearErr) {
                  console.error('Failed to clear:', clearErr);
                  Alert.alert('Error', 'Failed to clear corrupted data');
                }
              },
            },
          ]
        );
      }
    }
  };

  const handleLock = () => {
    lock();
    router.replace('/login');
  };

  const handleClear = async () => {
    Alert.alert(
      'Clear Seed Phrase',
      'Are you sure? This will delete your saved seed phrase.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: async () => {
            try {
              await removeItem('wallet_seed_phrase');
              setSavedSeedPhrase(null);
              Alert.alert('Success', 'Seed phrase cleared. Redirecting...');
              router.replace('/welcome');
            } catch (err) {
              Alert.alert('Error', 'Failed to clear seed phrase');
            }
          },
        },
      ]
    );
  };

  const words = savedSeedPhrase ? savedSeedPhrase.split(' ') : [];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Header */}
      <View style={styles.header}>
        <DashLogo />

        <Heading level={1} weight="extrabold" style={styles.title}>
          Your Wallet
        </Heading>

        <Text variant="body" weight="medium" opacity={50} style={styles.subtitle}>
          Your seed phrase is safely stored and encrypted
        </Text>
      </View>

      {/* Seed Phrase Display */}
      {savedSeedPhrase && (
        <View style={styles.phraseContainer}>
          <Text variant="body" weight="semibold" style={styles.sectionTitle}>
            Seed Phrase ({words.length} words)
          </Text>

          <View style={styles.wordsGrid}>
            {words.map((word, index) => (
              <View key={index} style={styles.wordItem}>
                <Text variant="caption" weight="medium" opacity={50} style={styles.wordNumber}>
                  {index + 1}.
                </Text>
                <Text variant="body" weight="medium" style={styles.wordText}>
                  {word}
                </Text>
              </View>
            ))}
          </View>

          <View style={styles.warningBox}>
            <Svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <Path
                d="M10 0C4.48 0 0 4.48 0 10C0 15.52 4.48 20 10 20C15.52 20 20 15.52 20 10C20 4.48 15.52 0 10 0ZM11 15H9V13H11V15ZM11 11H9V5H11V11Z"
                fill="#FF9500"
              />
            </Svg>
            <Text variant="caption" weight="medium" style={styles.warningText}>
              Keep your seed phrase secret and secure. Anyone with access to it can control your wallet.
            </Text>
          </View>
        </View>
      )}

      {/* Actions */}
      <View style={styles.actionsContainer}>
        <Button
          variant="outline"
          colorScheme="brand"
          size="xl"
          onPress={handleLock}
          style={styles.actionButton}
        >
          <Text weight="medium" style={styles.actionButtonText}>
            Lock Wallet
          </Text>
        </Button>

        {savedSeedPhrase && (
          <Button
            variant="outline"
            colorScheme="brand"
            size="xl"
            onPress={handleClear}
            style={[styles.actionButton, styles.deleteButton]}
          >
            <Text weight="medium" style={styles.deleteButtonText}>
              Clear Wallet
            </Text>
          </Button>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  contentContainer: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 47,
  },
  header: {
    alignItems: 'flex-start',
    gap: 10,
    marginBottom: 40,
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
  phraseContainer: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 16,
    color: '#0C1C33',
    marginBottom: 15,
  },
  wordsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 20,
  },
  wordItem: {
    width: '31%',
    backgroundColor: 'rgba(12, 28, 51, 0.03)',
    borderRadius: 15,
    borderWidth: 1,
    borderColor: 'rgba(12, 28, 51, 0.1)',
    paddingVertical: 10,
    paddingHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  wordNumber: {
    fontSize: 12,
    color: 'rgba(12, 28, 51, 0.5)',
  },
  wordText: {
    fontSize: 14,
    color: '#0C1C33',
  },
  warningBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    backgroundColor: 'rgba(255, 149, 0, 0.1)',
    padding: 15,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: 'rgba(255, 149, 0, 0.2)',
  },
  warningText: {
    flex: 1,
    fontSize: 12,
    lineHeight: 16,
    color: '#FF9500',
  },
  actionsContainer: {
    gap: 12,
    marginTop: 'auto',
  },
  actionButton: {
    backgroundColor: 'rgba(76, 126, 255, 0.15)',
    borderWidth: 0,
    borderRadius: 15,
    paddingVertical: 12,
    paddingHorizontal: 24,
    height: 58,
  },
  actionButtonText: {
    fontSize: 16,
    color: '#4C7EFF',
  },
  deleteButton: {
    backgroundColor: 'rgba(255, 59, 48, 0.1)',
  },
  deleteButtonText: {
    fontSize: 16,
    color: '#FF3B30',
  },
});
