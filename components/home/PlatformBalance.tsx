import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { useThemeColor } from '@/hooks/use-theme-color';

export interface PlatformBalanceProps {
  /**
   * Platform balance in Credits
   */
  platformBalance: number;
}

/**
 * Format large number with spaces as thousand separators
 * Example: 32000000000 -> "32 000 000 000"
 */
function formatCredits(value: number): string {
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}

/**
 * Platform Balance section component
 * 
 * Displays platform balance in Credits with:
 * - "Platform Balance:" label
 * - Large number display with space-separated formatting
 * - "Credits" unit label
 * - Gray text styling matching reference design
 * 
 * Design:
 * ```
 * Platform Balance:    32 000 000 000 Credits
 * ```
 */
export function PlatformBalance({ platformBalance }: PlatformBalanceProps) {
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');

  return (
    <View style={{ backgroundColor }}>
      <View style={styles.row}>
        <ThemedText style={styles.label}>Platform Balance:</ThemedText>
        <View style={styles.balanceContainer}>
          <ThemedText style={[styles.amount, { color: textColor }]}>
            {formatCredits(platformBalance)}
          </ThemedText>
          <ThemedText style={styles.unit}>Credits</ThemedText>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: 12,
  },
  label: {
    fontSize: 14,
    opacity: 0.6,
  },
  balanceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
  },
  amount: {
    fontSize: 18,
    fontWeight: '600',
    fontFamily: 'monospace',
    opacity: 0.8,
  },
  unit: {
    fontSize: 14,
    opacity: 0.6,
  },
});
