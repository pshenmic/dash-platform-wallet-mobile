import { useSecureStorage } from '@/contexts/SecureStorageContext'
import { Button, DashLogo, Heading, Input, Text } from 'dash-ui-kit/react-native'
import { router } from 'expo-router'
import { useState } from 'react'
import { Alert, StyleSheet, View } from 'react-native'

export default function SetupPasswordScreen() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { initialize, error } = useSecureStorage();

  const handleSetup = async () => {
    if (!password || password.length < 4) {
      Alert.alert('Error', 'Password must be at least 4 characters');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    try {
      setLoading(true);
      console.log('[SetupPassword] Initializing with password');
      await initialize(password);
      console.log('[SetupPassword] Initialization complete');
      
      if (__DEV__) {
        Alert.alert('Success', `Password created!\n\nDEV: Your password is "${password}"`);
      } else {
        Alert.alert('Success', 'Password created!');
      }
      
      console.log('[SetupPassword] Navigating to welcome...');
      router.replace('/welcome');
    } catch (err) {
      console.error('[SetupPassword] Setup failed:', err);
      Alert.alert('Error', error?.message || 'Setup failed');
    } finally {
      setLoading(false);
    }
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
          Setup Password
        </Heading>
        
        <Text 
          variant="body"
          weight="regular"
          opacity={60}
          style={styles.subtitle}
        >
          Create a password to protect your wallet.
        </Text>
      </View>

      {/* Password Setup Block */}
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
            placeholder="Enter Password"
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

        <View style={styles.inputSection}>
          <Text 
            variant="body"
            weight="regular"
            opacity={60}
            style={styles.inputLabel}
          >
            Confirm Password
          </Text>
          
          <Input
            placeholder="Re-enter Password"
            secureTextEntry
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            autoCapitalize="none"
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
          onPress={handleSetup}
          disabled={loading || !password || !confirmPassword}
          loading={loading}
          style={styles.button}
        >
          <Text weight="regular" style={styles.buttonText}>
            Create Password
          </Text>
        </Button>
      </View>
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
});
