/**
 * Withdraw Screen
 * 
 * Screen for withdrawing Dash to external wallet or exchange.
 * Placeholder implementation - full functionality to be added later.
 */

import { Ionicons } from '@expo/vector-icons';
import { StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function WithdrawScreen() {
  const colorScheme = useColorScheme();
  const iconColor = Colors[colorScheme ?? 'light'].tint;

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.content}>
        <Ionicons name="arrow-down-circle-outline" size={64} color={iconColor} />
        <ThemedText type="title" style={styles.title}>
          Withdraw Dash
        </ThemedText>
        <ThemedText style={styles.description}>
          Withdraw Dash to an external wallet or exchange
        </ThemedText>
        <ThemedText style={styles.placeholder}>
          Coming soon...
        </ThemedText>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    gap: 16,
  },
  title: {
    marginTop: 16,
  },
  description: {
    textAlign: 'center',
    opacity: 0.7,
  },
  placeholder: {
    marginTop: 8,
    opacity: 0.5,
    fontStyle: 'italic',
  },
});
