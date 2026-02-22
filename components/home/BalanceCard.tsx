import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { useBalanceVisibility } from '@/hooks/use-balance-visibility';
import { useThemeColor } from '@/hooks/use-theme-color';
// import { Text } from 'react-native';
import { BigNumber, Text, ValueCard, colors } from 'dash-ui-kit/react-native';

export interface BalanceCardProps {
  /**
   * Main balance in Dash
   */
  balance: number;
  /**
   * USD equivalent value
   */
  usdValue: number;
}

/**
 * Format currency with proper decimal places
 */
function formatCurrency(value: number): string {
  return value.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

/**
 * Balance card component with show/hide toggle
 * 
 * Displays main balance in Dash with:
 * - Large balance amount
 * - Decimal formatting
 * - USD conversion below
 * - Eye icon button to show/hide balance
 * - When hidden, shows "••••••" instead of amount
 * 
 * Design matches reference:
 * ```
 * Balance:
 * 12,864.71
 * ~ $6221.00 USD
 * ```
 */
export function BalanceCard({ balance, usdValue }: BalanceCardProps) {
  const { isVisible, toggleVisibility, isLoading } = useBalanceVisibility();
  const iconColor = useThemeColor({}, 'icon');
  const textColor = useThemeColor({}, 'text');

  if (isLoading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={[styles.skeleton, styles.skeletonLabel]} />
        </View>
        <View style={[styles.skeleton, styles.skeletonBalance]} />
        <View style={[styles.skeleton, styles.skeletonUsd]} />
      </View>
    );
  }

  return (
    <View>
      {/* Header with Label and Eye Icon */}
      <View style={styles.header}>
        <Text style={styles.label}>Balance:</Text>
        <Pressable
          onPress={toggleVisibility}
          style={({ pressed }) => [
            styles.eyeButton,
            pressed && styles.eyeButtonPressed,
          ]}
          hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
        >
          <ValueCard size="xs" colorScheme="lightGray" border={false}>
            <Ionicons
              name={isVisible ? 'eye-outline' : 'eye-off-outline'}
              size={16}
              color={iconColor}
            />
          </ValueCard>
        </Pressable>
      </View>

      <View style={styles.container}>
        {/* Large Balance Amount */}
        {isVisible ? (
          <View style={styles.balanceRow}>
            {/* <Text>Balance</Text> */}
            <BigNumber
              textStyle={{ fontSize: 48, fontWeight: '600', color: colors.brand }}
            >
              {balance}
            </BigNumber>
          </View>
        ) : (
          <ThemedText style={styles.balanceHidden}>••••••</ThemedText>
        )}

        {/* USD Value */}
        {isVisible && (
          <ValueCard size="xs" colorScheme="lightBlue" border={false}>
            <Text color="blue">
              ~ ${formatCurrency(usdValue)} USD
            </Text>
          </ValueCard>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  label: {
    fontSize: 48,
    lineHeight: 48,
  },
  eyeButton: {
    padding: 4,
  },
  eyeButtonPressed: {
    opacity: 0.6,
  },
  balanceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 8,
  },
  balanceInteger: {
    fontSize: 48,
    fontWeight: '600',
    fontFamily: 'monospace',
  },
  balanceDecimal: {
    fontSize: 32,
    fontWeight: '400',
    opacity: 0.7,
    fontFamily: 'monospace',
  },
  balanceHidden: {
    fontSize: 48,
    fontWeight: '600',
    marginBottom: 8,
  },
  usdValue: {
    fontSize: 16,
    opacity: 0.6,
  },
  skeleton: {
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
  },
  skeletonLabel: {
    width: 70,
    height: 16,
  },
  skeletonBalance: {
    width: 220,
    height: 48,
    marginVertical: 8,
  },
  skeletonUsd: {
    width: 140,
    height: 16,
  },
});
