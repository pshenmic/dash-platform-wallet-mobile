/**
 * Home Screen
 * 
 * Main dashboard screen for authenticated users.
 * Displays wallet overview, balance, identity, and transactions.
 */

import { router } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  RefreshControl,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';

import { BalanceDisplay } from '@/components/home/BalanceDisplay';
import { HomeTabs } from '@/components/home/HomeTabs';
import { IdentitySection } from '@/components/home/IdentitySection';
import { TransactionList } from '@/components/home/TransactionList';
import { WalletHeader } from '@/components/home/WalletHeader';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useBalance } from '@/hooks/use-balance';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useTransactionHistory } from '@/hooks/use-transaction-history';
import { useWalletData } from '@/hooks/use-wallet-data';
import { secureStorage } from '@/services/storage/secure-storage';
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

  /**
   * Check authentication status and redirect if not authenticated
   * This implements route protection for the home screen
   */
  const checkAuthAndLoadData = useCallback(async () => {
    try {
      console.log('[HomeScreen] Checking auth status...');
      
      // Check if password is set up
      const salt = await SecureStore.getItemAsync('encryption_salt');
      
      if (!salt) {
        // No password setup - redirect to setup
        console.log('[HomeScreen] No password found, redirecting to setup');
        router.replace('/setup-password');
        return;
      }
      
      if (!secureStorage.isUnlocked()) {
        // Password exists but locked - redirect to login
        console.log('[HomeScreen] Storage locked, redirecting to login');
        router.replace('/login');
        return;
      }
      
      // Check if wallet exists
      const seedPhrase = await secureStorage.getItem('wallet_seed_phrase');
      if (!seedPhrase) {
        // No wallet - redirect to welcome/setup
        console.log('[HomeScreen] No wallet found, redirecting to welcome');
        router.replace('/welcome');
        return;
      }
      
      // User is authenticated and has wallet
      console.log('[HomeScreen] Auth check passed');
      
    } catch (error) {
      console.error('[HomeScreen] Auth check failed:', error);
      // On error, redirect to setup to be safe
      router.replace('/setup-password');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuthAndLoadData();
  }, [checkAuthAndLoadData]);

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
