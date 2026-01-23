import { useState, useEffect } from 'react';
import { View, TextInput, Button, Text, StyleSheet, Alert, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { useSecureStorage } from '@/hooks/use-secure-storage';

export default function WalletScreen() {
  const [seedPhrase, setSeedPhrase] = useState('');
  const [savedSeedPhrase, setSavedSeedPhrase] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { isUnlocked, lock, saveItem, getItem, removeItem, error } = useSecureStorage();

  useEffect(() => {
    checkLock();
    loadSeedPhrase();
  }, [isUnlocked]);

  const checkLock = () => {
    if (!isUnlocked) {
      Alert.alert('Locked', 'Please login first');
      router.replace('/login');
    }
  };

  const loadSeedPhrase = async () => {
    if (!isUnlocked) return;
    
    try {
      const saved = await getItem('wallet_seed_phrase');
      setSavedSeedPhrase(saved);
    } catch (err) {
      console.error('Failed to load seed phrase:', err);
    }
  };

  const handleSave = async () => {
    if (!seedPhrase || seedPhrase.split(' ').length < 12) {
      Alert.alert('Error', 'Please enter a valid seed phrase (at least 12 words)');
      return;
    }

    try {
      setLoading(true);
      await saveItem('wallet_seed_phrase', seedPhrase);
      Alert.alert('Success', 'Seed phrase saved securely!');
      setSavedSeedPhrase(seedPhrase);
      setSeedPhrase('');
    } catch (err) {
      Alert.alert('Error', error?.message || 'Save failed');
    } finally {
      setLoading(false);
    }
  };

  const handleLock = () => {
    lock();
    Alert.alert('Locked', 'Wallet locked');
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
              Alert.alert('Success', 'Seed phrase cleared');
            } catch (err) {
              Alert.alert('Error', error?.message || 'Failed to clear');
            }
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Wallet</Text>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Save Seed Phrase</Text>
        <Text style={styles.hint}>
          Enter your 12-24 word seed phrase (space-separated)
        </Text>
        
        <TextInput
          style={styles.textarea}
          placeholder="word1 word2 word3 ..."
          value={seedPhrase}
          onChangeText={setSeedPhrase}
          multiline
          numberOfLines={4}
          autoCapitalize="none"
          autoCorrect={false}
        />
        
        <Button
          title={loading ? 'Saving...' : 'Save Encrypted'}
          onPress={handleSave}
          disabled={loading}
        />
      </View>

      {savedSeedPhrase && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Saved Seed Phrase (Decrypted)</Text>
          <View style={styles.savedBox}>
            <Text style={styles.savedText}>{savedSeedPhrase}</Text>
          </View>
          <Text style={styles.hint}>
            ✅ This is stored encrypted and only visible when unlocked
          </Text>
          <Button title="Clear Saved Seed" onPress={handleClear} color="red" />
        </View>
      )}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Security</Text>
        <Text style={styles.hint}>
          🔒 Your seed phrase is encrypted with AES-256-GCM{'\n'}
          🔑 Only accessible with your password{'\n'}
          📱 Stored securely using device keychain
        </Text>
        <Button title="Lock Wallet" onPress={handleLock} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 40,
    marginBottom: 20,
    textAlign: 'center',
  },
  section: {
    marginBottom: 30,
    padding: 15,
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
  },
  hint: {
    fontSize: 12,
    color: '#666',
    marginBottom: 15,
    lineHeight: 18,
  },
  textarea: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 15,
    marginBottom: 15,
    borderRadius: 8,
    fontSize: 14,
    backgroundColor: '#fff',
    minHeight: 100,
  },
  savedBox: {
    backgroundColor: '#e8f5e9',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  savedText: {
    fontSize: 14,
    lineHeight: 22,
  },
});
