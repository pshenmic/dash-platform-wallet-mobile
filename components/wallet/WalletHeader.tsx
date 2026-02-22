import { StyleSheet, View } from 'react-native';

import { NotificationButton } from '@/components/ui/NotificationButton';
import { WalletSelector } from './WalletSelector';

export interface WalletHeaderProps {
  /**
   * Wallet information to display
   */
  wallet: {
    name: string;
    type: string;
  };
  /**
   * Handler called when wallet selector is pressed
   */
  onWalletPress?: () => void;
  /**
   * Handler called when notification button is pressed
   */
  onNotificationPress?: () => void;
}

/**
 * Header component with wallet selector and notification button
 * 
 * Main header for the home screen displaying:
 * - Wallet selector button (left) - shows wallet name and type
 * - Notification button (right) - bell icon for notifications
 */
export function WalletHeader({ 
  wallet, 
  onWalletPress, 
  onNotificationPress 
}: WalletHeaderProps) {
  return (
    <View style={styles.container}>
      <WalletSelector
        name={wallet.name}
        type={wallet.type}
        onPress={onWalletPress}
      />
      <NotificationButton onPress={onNotificationPress} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
});
