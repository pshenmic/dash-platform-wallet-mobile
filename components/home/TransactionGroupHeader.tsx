import { ThemedText } from '@/components/themed-text';
import { StyleSheet, View } from 'react-native';

export interface TransactionGroupHeaderProps {
  /**
   * Date display string (e.g., "20 June 2025")
   */
  date: string;
}

/**
 * Transaction group header component
 * 
 * Displays a date header with subtle styling for grouping transactions.
 * Used as a section header in the transaction list.
 */
export function TransactionGroupHeader({ date }: TransactionGroupHeaderProps) {
  return (
    <View style={styles.container}>
      <ThemedText style={styles.text}>{date}</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 0,
    paddingBottom: 0,
    paddingHorizontal: 0,
  },
  text: {
    fontSize: 14,
    fontWeight: '600',
    opacity: 0.6,
  },
});
