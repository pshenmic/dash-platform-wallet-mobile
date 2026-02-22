import { ThemedText } from '@/components/themed-text';
import { useThemeColor } from '@/hooks/use-theme-color';
import {
  useTransactionHistory,
  type TransactionGroup,
} from '@/hooks/use-transaction-history';
import { type Transaction } from '@/types/transaction';
import { Ionicons } from '@expo/vector-icons';
import {
  StyleSheet,
  View,
} from 'react-native';
import { TransactionGroupHeader } from './TransactionGroupHeader';
import { TransactionItem } from './TransactionItem';

export interface TransactionListProps {
  /**
   * Handler called when a transaction is pressed
   */
  onTransactionPress?: (transaction: Transaction) => void;
}

/**
 * Flattened item for FlatList
 */
interface FlatListItem {
  type: 'header' | 'transaction';
  id: string;
  data: TransactionGroup | Transaction;
}

/**
 * Loading skeleton component
 */
function LoadingSkeleton() {
  const overlayColor = useThemeColor({}, 'overlay');

  return (
    <View style={styles.skeletonContainer}>
      {[1, 2, 3, 4, 5].map((i) => (
        <View key={i} style={styles.skeletonItem}>
          <View
            style={[
              styles.skeletonCircle,
              { backgroundColor: overlayColor },
            ]}
          />
          <View style={styles.skeletonContent}>
            <View
              style={[
                styles.skeletonLine,
                styles.skeletonLineWide,
                { backgroundColor: overlayColor },
              ]}
            />
            <View
              style={[
                styles.skeletonLine,
                styles.skeletonLineNarrow,
                { backgroundColor: overlayColor },
              ]}
            />
          </View>
        </View>
      ))}
    </View>
  );
}

/**
 * Empty state component
 */
function EmptyState() {
  const iconColor = useThemeColor({}, 'icon');

  return (
    <View style={styles.emptyContainer}>
      <Ionicons name="receipt-outline" size={64} color={iconColor} />
      <ThemedText style={styles.emptyTitle}>No Transactions</ThemedText>
      <ThemedText style={styles.emptyMessage}>
        Your transaction history will appear here
      </ThemedText>
    </View>
  );
}

/**
 * Flattens grouped transactions into a single array for FlatList
 */
function flattenGroups(groups: TransactionGroup[]): FlatListItem[] {
  const items: FlatListItem[] = [];

  for (const group of groups) {
    // Add header
    items.push({
      type: 'header',
      id: `header-${group.date}`,
      data: group,
    });

    // Add transactions
    for (const transaction of group.transactions) {
      items.push({
        type: 'transaction',
        id: transaction.id,
        data: transaction,
      });
    }
  }

  return items;
}

/**
 * Main transaction list component
 * 
 * Displays a list of transactions grouped by date with:
 * - Simple View rendering (no FlatList to avoid nesting issues)
 * - Empty state with icon and message
 * - Loading skeleton (3-5 rows)
 * - Refresh handled by parent ScrollView
 */
export function TransactionList({
  onTransactionPress,
}: TransactionListProps) {
  const { groups, loading, error } = useTransactionHistory();

  const flattenedItems = flattenGroups(groups);

  if (loading && groups.length === 0) {
    return <LoadingSkeleton />;
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <ThemedText style={styles.errorText}>
          Failed to load transactions
        </ThemedText>
        <ThemedText style={styles.errorMessage}>{error.message}</ThemedText>
      </View>
    );
  }

  if (groups.length === 0) {
    return <EmptyState />;
  }

  return (
    <View style={styles.container}>
      {flattenedItems.map((item) => {
        if (item.type === 'header') {
          const group = item.data as TransactionGroup;
          return <TransactionGroupHeader key={item.id} date={group.dateDisplay} />;
        }

        const transaction = item.data as Transaction;
        return (
          <TransactionItem
            key={item.id}
            transaction={transaction}
            onPress={onTransactionPress}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingVertical: 8,
  },
  emptyContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingVertical: 64,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyMessage: {
    fontSize: 15,
    opacity: 0.6,
    textAlign: 'center',
  },
  errorContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingVertical: 32,
  },
  errorText: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    color: '#EF4444',
  },
  errorMessage: {
    fontSize: 14,
    opacity: 0.6,
    textAlign: 'center',
  },
  skeletonContainer: {
    padding: 16,
  },
  skeletonItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  skeletonCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 12,
  },
  skeletonContent: {
    flex: 1,
    gap: 8,
  },
  skeletonLine: {
    height: 12,
    borderRadius: 6,
  },
  skeletonLineWide: {
    width: '70%',
  },
  skeletonLineNarrow: {
    width: '50%',
  },
});
