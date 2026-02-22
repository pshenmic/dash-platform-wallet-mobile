import { StyleSheet, View } from 'react-native';

import { BalanceCard } from './BalanceCard';
import { PlatformBalance } from './PlatformBalance';

export interface BalanceDisplayProps {
  /**
   * Main balance in Dash
   */
  balance: number;
  /**
   * USD equivalent value
   */
  usdValue: number;
  /**
   * Platform balance in Credits
   */
  platformBalance: number;
}

/**
 * Balance Display Component
 * 
 * Main container for displaying wallet balances including:
 * - Main balance card with Dash amount and USD conversion
 * - Show/hide toggle for balance privacy
 * - Platform balance in Credits
 * 
 * Features:
 * - Balance visibility toggle with AsyncStorage persistence
 * - Proper number formatting with localization
 * - Themed styling for light/dark modes
 * - Responsive layout
 * 
 * Design:
 * ```
 * ┌─────────────────────────┐
 * │ Balance: Đ12,864.71  👁️ │
 * │ ~ $6221.00 USD          │
 * └─────────────────────────┘
 * 
 * ┌─────────────────────────┐
 * │ Platform Balance:       │
 * │ 32 000 000 000 Credits  │
 * └─────────────────────────┘
 * ```
 * 
 * @example
 * ```tsx
 * <BalanceDisplay
 *   balance={12864.71}
 *   usdValue={6221.00}
 *   platformBalance={32000000000}
 * />
 * ```
 */
export function BalanceDisplay({
  balance,
  usdValue,
  platformBalance,
}: BalanceDisplayProps) {
  return (
    <View style={styles.container}>
      <BalanceCard balance={balance} usdValue={usdValue} />
      <PlatformBalance platformBalance={platformBalance} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 4,
  },
});
