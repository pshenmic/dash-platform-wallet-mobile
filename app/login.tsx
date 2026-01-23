import { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet, Alert } from 'react-native';
import { router } from 'expo-router';
import { useSecureStorage } from '@/hooks/use-secure-storage';

export default function LoginScreen() {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { unlock, error } = useSecureStorage();

  const handleLogin = async () => {
    if (!password) {
      Alert.alert('Error', 'Please enter password');
      return;
    }

    try {
      setLoading(true);
      const success = await unlock(password);

      if (success) {
        Alert.alert('Success', 'Logged in!');
        router.replace('/wallet');
      } else {
        Alert.alert('Error', error?.message || 'Wrong password');
        setPassword('');
      }
    } catch (err) {
      Alert.alert('Error', error?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome Back</Text>
      <Text style={styles.subtitle}>Enter your password to unlock wallet</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        autoCapitalize="none"
        autoFocus
      />

      <Button
        title={loading ? 'Unlocking...' : 'Unlock'}
        onPress={handleLogin}
        disabled={loading}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 30,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 15,
    marginBottom: 15,
    borderRadius: 8,
    fontSize: 16,
  },
});
