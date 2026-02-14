import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { useThemeColor } from '@/hooks/use-theme-color';

export interface AccountNameProps {
  /**
   * Account name to display
   */
  accountName: string;
  /**
   * Handler called when edit button is pressed
   */
  onEditPress?: () => void;
}

/**
 * Account name display with edit button
 * 
 * Displays the account name with an edit icon button on the right.
 * Example: "Main_account [✏️]"
 */
export function AccountName({ accountName, onEditPress }: AccountNameProps) {
  const iconColor = useThemeColor({}, 'text');
  const backgroundColor = useThemeColor({}, 'background');

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <ThemedText style={styles.accountName} numberOfLines={1}>
        {accountName}
      </ThemedText>
      <Pressable
        style={({ pressed }) => [
          styles.editButton,
          pressed && styles.pressed,
        ]}
        onPress={() => onEditPress?.()}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <Ionicons 
          name="create-outline" 
          size={20} 
          color={iconColor} 
        />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  accountName: {
    fontSize: 16,
    fontWeight: '500',
    flex: 1,
  },
  editButton: {
    padding: 4,
    marginLeft: 8,
  },
  pressed: {
    opacity: 0.5,
  },
});
