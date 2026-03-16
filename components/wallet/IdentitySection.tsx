import { StyleSheet, View } from 'react-native';

import { useThemeColor } from '@/hooks/use-theme-color';
import { AccountName } from './AccountName';
import { AddressDisplay } from './AddressDisplay';

export interface IdentitySectionProps {
  /**
   * User wallet address
   */
  address: string;
  /**
   * Account name
   */
  accountName: string;
  /**
   * Handler called when address is pressed
   */
  onAddressPress?: () => void;
  /**
   * Handler called when account name edit button is pressed
   */
  onAccountNamePress?: () => void;
}

/**
 * Identity section component
 * 
 * Main container for user identity information displaying:
 * - User address with avatar and dropdown (using dash-ui-kit Identifier)
 * - Divider line
 * - Account name with edit button
 */
export function IdentitySection({
  address,
  accountName,
  onAddressPress,
  onAccountNamePress,
}: IdentitySectionProps) {
  const dividerColor = useThemeColor({}, 'overlay');

  return (
    <View style={styles.container}>
      <View style={styles.addressContainer}>
        <AddressDisplay 
          address={address} 
          onPress={onAddressPress}
        />
      </View>
      
      {/* <View style={[styles.divider, { backgroundColor: dividerColor }]} /> */}
      <View style={styles.accountNameContainer}>
        <AccountName
          accountName={accountName} 
          onEditPress={onAccountNamePress}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  divider: {
    height: 1,
    marginHorizontal: 16,
  },
  addressContainer: {
    flex: 1,
  },
  accountNameContainer: {
    flex: 1,
  },
});
