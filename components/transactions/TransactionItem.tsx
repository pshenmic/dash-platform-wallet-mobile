import { ThemedText } from '@/components/themed-text';
import { useThemeColor } from '@/hooks/use-theme-color';
import { type Transaction } from '@/types/transaction';
import { Identifier, ValueCard } from 'dash-ui-kit/react-native';
import { memo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { ChainBadge } from './ChainBadge';
import { TransactionIcon } from './TransactionIcon';

export interface TransactionItemProps {
  /**
   * Transaction data to display
   */
  transaction: Transaction;
  /**
   * Handler called when item is pressed
   */
  onPress?: (transaction: Transaction) => void;
}

/**
 * Formats amount with +/- prefix based on transaction type
 */
function formatAmount(amount: number, type: Transaction['type']): string {
  const prefix = type === 'receive' ? '+' : '-';
  const absAmount = Math.abs(amount);
  
  // Format with space separators for thousands
  const formatted = absAmount.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 8,
  });
  
  return `${prefix}${formatted} Credits`;
}

/**
 * Formats USD amount with proper formatting
 */
function formatUsdAmount(usdAmount: number): string {
  return `~ $${usdAmount.toFixed(3)}`;
}

/**
 * Gets transaction type label
 */
function getTransactionTypeLabel(type: Transaction['type']): string {
  switch (type) {
    case 'receive':
      return 'Receive';
    case 'send':
      return 'Send';
    case 'documents_batch':
      return 'Documents Batch';
  }
}

/**
 * Individual transaction item component
 * 
 * Displays:
 * - Icon (based on transaction type)
 * - Chain badge (Core/Platform)
 * - Transaction type label
 * - From/To/Hash with truncated identifier
 * - Amount with +/- prefix
 * - USD equivalent
 */
function TransactionItemComponent({
  transaction,
  onPress,
}: TransactionItemProps) {
  const backgroundColor = useThemeColor({}, 'background');
  const overlayColor = useThemeColor({}, 'overlay');
  const iconColor = useThemeColor({}, 'icon');

  const { type, chain, amount, usdAmount, from, to, hash } = transaction;
  
  const typeLabel = getTransactionTypeLabel(type);
  const formattedAmount = formatAmount(amount, type);
  const formattedUsdAmount = formatUsdAmount(usdAmount);
  
  // Determine which identifier to show
  let identifierValue = '';
  let identifierLabel = '';
  
  if (type === 'receive' && from) {
    identifierLabel = 'From:';
    identifierValue = from;
  } else if (type === 'send' && to) {
    identifierLabel = 'To:';
    identifierValue = to;
  } else if (type === 'documents_batch' && hash) {
    identifierLabel = 'Hash:';
    identifierValue = hash;
  }

  const amountColor = type === 'receive' ? '#10B981' : type === 'send' ? '#EF4444' : iconColor;

  return (
    <Pressable
      style={({ pressed }) => [
        styles.container,
        { backgroundColor },
        pressed && { backgroundColor: overlayColor },
      ]}
      onPress={() => onPress?.(transaction)}
    >
      <ValueCard colorScheme="lightGray" border={false}>
        <View style={styles.iconContainer}>
          <TransactionIcon type={type} />
        </View>

        <View style={styles.content}>
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <ChainBadge chain={chain} />
              <ThemedText style={styles.typeLabel}>{typeLabel}</ThemedText>
            </View>
            <ThemedText style={[styles.amount, { color: amountColor }]}>
              {formattedAmount}
            </ThemedText>
          </View>

          <View style={styles.details}>
            <View style={styles.identifierContainer}>
              <ThemedText style={styles.identifierLabel}>
                {identifierLabel}
              </ThemedText>
              {identifierValue ? (
                <Identifier
                  value={identifierValue}
                  truncate="middle"
                  style={styles.identifier}
                />
              ) : null}
            </View>
            <ThemedText style={styles.usdAmount}>{formattedUsdAmount}</ThemedText>
          </View>
        </View>
      </ValueCard>
    </Pressable>
  );
}

/**
 * Memoized transaction item for performance
 */
export const TransactionItem = memo(
  TransactionItemComponent,
  (prevProps, nextProps) => {
    return prevProps.transaction.id === nextProps.transaction.id;
  }
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 0,
    alignItems: 'flex-start',
    width: '100%',
  },
  iconContainer: {
    marginRight: 12,
    marginTop: 2,
  },
  content: {
    flex: 1,
    gap: 4,
    minWidth: 0, // Prevents overflow
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
    minWidth: 0, // Prevents overflow
  },
  typeLabel: {
    fontSize: 15,
    fontWeight: '500',
  },
  amount: {
    fontSize: 15,
    fontWeight: '600',
    marginLeft: 8,
    flexShrink: 0, // Prevent amount from shrinking
  },
  details: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  identifierContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    flex: 1,
    minWidth: 0, // Prevents overflow
  },
  identifierLabel: {
    fontSize: 13,
    opacity: 0.6,
  },
  identifier: {
    fontSize: 13,
    flex: 1,
    minWidth: 0, // Prevents overflow
  },
  usdAmount: {
    fontSize: 13,
    opacity: 0.6,
    marginLeft: 8,
    flexShrink: 0, // Prevent USD amount from shrinking
  },
});
