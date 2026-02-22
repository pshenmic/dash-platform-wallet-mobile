import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { GlassView, isGlassEffectAPIAvailable } from 'expo-glass-effect';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';

export interface WalletSelectorProps {
  /**
   * Wallet name to display
   */
  name: string;
  /**
   * Wallet type to display below the name
   */
  type: string;
  /**
   * Handler called when wallet selector is pressed
   */
  onPress?: () => void;
}

const useNativeGlass = Platform.OS === 'ios' && isGlassEffectAPIAvailable();

/** Figma: rgba(255, 255, 255, 0.12) — glass fill for header on gradient background */
const GLASS_FILL = 'rgba(255, 255, 255, 0.12)';

/**
 * Wallet selector button component
 *
 * Displays a liquid glass button with wallet icon, name, type, and dropdown chevron.
 * Designed to sit on the blue gradient hero area of the home screen.
 */
export function WalletSelector({ name, type, onPress }: WalletSelectorProps) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.pressable,
        pressed && styles.pressed,
      ]}
      onPress={() => onPress?.()}
    >
      <View style={styles.container}>
        {useNativeGlass ? (
          <GlassView style={StyleSheet.absoluteFill} />
        ) : (
          <BlurView intensity={20} tint="light" style={StyleSheet.absoluteFill} />
        )}
        <View style={[styles.iconContainer, { backgroundColor: GLASS_FILL }]}>
          <MaterialCommunityIcons
            name="wallet-outline"
            size={24}
            color="#FFFFFF"
          />
        </View>

        <View style={styles.textContainer}>
          <Text style={styles.walletName} numberOfLines={1}>
            {name}
          </Text>
          <Text style={styles.walletType} numberOfLines={1}>
            {type}
          </Text>
        </View>

        <Ionicons
          name="chevron-down"
          size={12}
          color="#FFFFFF"
          style={styles.chevron}
        />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pressable: {
    borderRadius: 48,
    alignSelf: 'flex-start',
    backgroundColor: GLASS_FILL,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.35)',
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  pressed: {
    transform: [{ scale: 0.97 }],
  },
  container: {
    borderRadius: 48,
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    paddingLeft: 4,
    paddingRight: 12,
    gap: 10,
    overflow: 'hidden',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    justifyContent: 'center',
    gap: 2,
  },
  walletName: {
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 17,
    color: '#FFFFFF',
    fontFamily: Platform.select({ ios: 'SF Pro', default: 'System' }),
  },
  walletType: {
    fontSize: 10,
    fontWeight: '400',
    lineHeight: 12,
    color: 'rgba(255, 255, 255, 0.5)',
    fontFamily: Platform.select({ ios: 'SF Pro', default: 'System' }),
  },
  chevron: {
    marginLeft: 4,
  },
});
