/**
 * Home Screen
 * 
 * Main dashboard screen for authenticated users.
 * Displays wallet overview, balance, identity, and transactions.
 */

import { LinearGradient } from 'expo-linear-gradient';
import { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  RefreshControl,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';

import { HomeTabs } from '@/components/home/HomeTabs';
import { TransactionList } from '@/components/transactions/TransactionList';
import { BalanceDisplay } from '@/components/wallet/BalanceDisplay';
import { IdentitySection } from '@/components/wallet/IdentitySection';
import { WalletHeader } from '@/components/wallet/WalletHeader';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useAuthGuard } from '@/hooks/use-auth-guard';
import { useBalance } from '@/hooks/use-balance';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useTransactionHistory } from '@/hooks/use-transaction-history';
import { useWalletData } from '@/hooks/use-wallet-data';
import { type HomeTab } from '@/types/home';
import { ValueCard } from 'dash-ui-kit/react-native';

/**
 * Placeholder component for coming soon tabs
 */
function PlaceholderView({ text }: { text: string }) {
  return (
    <View style={styles.placeholderContainer}>
      <ThemedText style={styles.placeholderText}>{text}</ThemedText>
    </View>
  );
}

export default function HomeScreen() {
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<HomeTab>('transactions');
  const [refreshing, setRefreshing] = useState(false);
  const colorScheme = useColorScheme();

  // Hooks for data fetching
  const { wallet, loading: walletLoading, error: walletError, refresh: refreshWallet } = useWalletData();
  const { balance, loading: balanceLoading, error: balanceError, refresh: refreshBalance } = useBalance();
  const { groups: transactionGroups, loading: transactionsLoading, error: transactionsError, refresh: refreshTransactions } = useTransactionHistory();

  const handleAuthenticated = useCallback(() => {
    console.log('[HomeScreen] Auth check passed');
    setIsLoading(false);
  }, []);

  useAuthGuard({ onAuthenticated: handleAuthenticated });

  /**
   * Handle pull-to-refresh
   * Refreshes all data sources (wallet, balance, transactions)
   */
  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await Promise.all([
        refreshWallet(),
        refreshBalance(),
        refreshTransactions(),
      ]);
    } catch (error) {
      console.error('[HomeScreen] Refresh failed:', error);
      Alert.alert('Error', 'Failed to refresh data. Please try again.');
    } finally {
      setRefreshing(false);
    }
  }, [refreshWallet, refreshBalance, refreshTransactions]);

  /**
   * Handle wallet selector press
   */
  const handleWalletPress = useCallback(() => {
    console.log('[HomeScreen] Wallet selector pressed');
    // TODO: Navigate to wallet selector screen
  }, []);

  /**
   * Handle notification button press
   */
  const handleNotificationPress = useCallback(() => {
    console.log('[HomeScreen] Notification button pressed');
    // TODO: Navigate to notifications screen
  }, []);

  /**
   * Handle address press
   */
  const handleAddressPress = useCallback(() => {
    console.log('[HomeScreen] Address pressed');
    // TODO: Show address options (copy, QR code, etc.)
  }, []);

  /**
   * Handle account name edit press
   */
  const handleAccountNamePress = useCallback(() => {
    console.log('[HomeScreen] Account name edit pressed');
    // TODO: Navigate to account name edit screen
  }, []);

  /**
   * Handle filter button press
   */
  const handleFilterPress = useCallback(() => {
    console.log('[HomeScreen] Filter button pressed');
    // TODO: Show filter options
  }, []);

  /**
   * Handle transaction item press
   */
  const handleTransactionPress = useCallback((transaction: any) => {
    console.log('[HomeScreen] Transaction pressed:', transaction.id, transaction.type);
    // TODO: Navigate to transaction detail screen
  }, []);

  // Initial loading state (auth check)
  if (isLoading) {
    return (
      <ThemedView style={styles.container}>
        <ActivityIndicator 
          size="large" 
          color={Colors[colorScheme ?? 'light'].tint} 
        />
        <ThemedText style={styles.loadingText}>Loading...</ThemedText>
      </ThemedView>
    );
  }

  // Data loading state (first load)
  const isFirstLoad = walletLoading || balanceLoading || transactionsLoading;
  if (isFirstLoad && !wallet && !balance && transactionGroups.length === 0) {
    return (
      <ThemedView style={styles.container}>
        <ActivityIndicator 
          size="large" 
          color={Colors[colorScheme ?? 'light'].tint} 
        />
        <ThemedText style={styles.loadingText}>Loading wallet data...</ThemedText>
      </ThemedView>
    );
  }

  // Error states (show errors but don't block entire UI)
  const hasErrors = walletError || balanceError || transactionsError;
  if (hasErrors && !wallet && !balance) {
    return (
      <ThemedView style={styles.container}>
        <View style={styles.errorContainer}>
          <ThemedText style={styles.errorText}>Failed to load wallet data</ThemedText>
          <ThemedText style={styles.errorMessage}>
            {walletError?.message || balanceError?.message || transactionsError?.message}
          </ThemedText>
          <ThemedText 
            style={styles.retryText}
            onPress={handleRefresh}
          >
            Tap to retry
          </ThemedText>
        </View>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      {/* Blue gradient glow — top hero area, matches Figma design */}
      <LinearGradient
        colors={['rgba(76, 126, 255, 0)', 'rgba(76, 126, 255, 0.85)', 'rgba(76, 126, 255, 0)']}
        locations={[0, 0.3, 0.65]}
        start={{ x: 1, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.heroGradient}
        pointerEvents="none"
      />
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={Colors[colorScheme ?? 'light'].tint}
          />
        }
      >
        {/* Header */}
        {wallet && (
          <WalletHeader 
            wallet={wallet}
            onWalletPress={handleWalletPress}
            onNotificationPress={handleNotificationPress}
          />
        )}
        
        {/* Identity Section */}
        {wallet && (
          <View style={styles.section}>
            <IdentitySection
              address={wallet.address}
              accountName="Main_account"
              onAddressPress={handleAddressPress}
              onAccountNamePress={handleAccountNamePress}
            />
          </View>
        )}

        {/* Balance Display */}
        {balance && (
          <View style={styles.section}>
            <BalanceDisplay
              balance={balance.total}
              usdValue={balance.usdValue}
              platformBalance={balance.platformBalance}
            />
          </View>
        )}

        {/* Tabs and Content Card */}
        <View style={styles.cardWrapper}>
          <ValueCard 
            size="md" 
            colorScheme="white"
            style={styles.valueCard}
          >
            <View style={styles.cardInner}>
              {/* Tabs */}
              <HomeTabs
                activeTab={activeTab}
                onTabChange={setActiveTab}
                onFilterPress={handleFilterPress}
              />
              
              {/* Tab Content */}
              <View style={styles.tabContent}>
                {activeTab === 'transactions' && (
                  <TransactionList
                    transactionGroups={transactionGroups}
                    isLoading={transactionsLoading}
                    error={transactionsError}
                    onTransactionPress={handleTransactionPress}
                  />
                )}
                {activeTab === 'tokens' && <PlaceholderView text="Tokens coming soon" />}
                {activeTab === 'names' && <PlaceholderView text="Names coming soon" />}
              </View>
            </View>
          </ValueCard>
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  heroGradient: {
    position: 'absolute',
    top: 0,
    left: -160,
    width: 760,
    height: 620,
    zIndex: 0,
  },
  scrollView: {
    flex: 1,
    marginTop: 64,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  section: {
    paddingHorizontal: 16,
    marginBottom: 18,
  },
  cardWrapper: {
    marginTop: 32,
    // iOS shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    // Android shadow
    elevation: 6,
  },
  valueCard: {
    minHeight: 400,
    overflow: 'hidden',
  },
  cardInner: {
    width: '100%',
  },
  tabContent: {
    width: '100%',
  },
  placeholderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 64,
    paddingHorizontal: 32,
  },
  placeholderText: {
    fontSize: 16,
    opacity: 0.6,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  loadingText: {
    marginTop: 16,
    opacity: 0.6,
    textAlign: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  errorText: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    color: '#EF4444',
    textAlign: 'center',
  },
  errorMessage: {
    fontSize: 14,
    opacity: 0.6,
    textAlign: 'center',
    marginBottom: 16,
  },
  retryText: {
    fontSize: 16,
    color: '#3B82F6',
    fontWeight: '600',
    marginTop: 8,
  },
});
