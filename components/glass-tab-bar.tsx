import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { BlurView } from 'expo-blur';
import { GlassView, isGlassEffectAPIAvailable } from 'expo-glass-effect';
import { Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const useNativeGlass = Platform.OS === 'ios' && isGlassEffectAPIAvailable();

export function GlassTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const tabItems = state.routes.map((route, index) => {
    const { options } = descriptors[route.key];
    const label =
      options.tabBarLabel !== undefined
        ? options.tabBarLabel
        : options.title !== undefined
        ? options.title
        : route.name;

    const isFocused = state.index === index;

    const onPress = () => {
      const event = navigation.emit({
        type: 'tabPress',
        target: route.key,
        canPreventDefault: true,
      });

      if (!isFocused && !event.defaultPrevented) {
        navigation.navigate(route.name, route.params);
      }
    };

    const onLongPress = () => {
      navigation.emit({
        type: 'tabLongPress',
        target: route.key,
      });
    };

    const iconColor = isFocused ? colors.tint : colors.tabIconDefault;
    const opacity = isFocused ? 1 : 0.5;

    return (
      <TouchableOpacity
        key={route.key}
        accessibilityRole="button"
        accessibilityState={isFocused ? { selected: true } : {}}
        accessibilityLabel={options.tabBarAccessibilityLabel}
        testID={(options as { tabBarTestID?: string }).tabBarTestID}
        onPress={onPress}
        onLongPress={onLongPress}
        style={styles.tabItem}
      >
        <View style={[styles.tabContent, { opacity }]}>
          {options.tabBarIcon && options.tabBarIcon({
            focused: isFocused,
            color: iconColor,
            size: 30,
          })}
          <Text
            style={[
              styles.tabLabel,
              { color: iconColor },
            ]}
          >
            {typeof label === 'string' ? label : ''}
          </Text>
        </View>
      </TouchableOpacity>
    );
  });

  return (
    <View style={styles.container}>
      <View style={styles.shadowWrapper}>
        <View style={[styles.glassContainer, !useNativeGlass && { backgroundColor: colors.glassBackground }]}>
          {useNativeGlass && (
            <GlassView style={StyleSheet.absoluteFill} />
          )}
          {!useNativeGlass && (
            <BlurView intensity={20} tint="light" style={StyleSheet.absoluteFill} />
          )}
          {tabItems}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingBottom: Platform.select({ ios: 24, android: 16, default: 24 }),
  },
  shadowWrapper: {
    borderRadius: 48,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.35)',
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 24,
      },
      android: {
        elevation: 16,
      },
    }),
  },
  glassContainer: {
    borderRadius: 48,
    overflow: 'hidden',
    height: 65,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabContent: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '590' as unknown as 'bold',
    textAlign: 'center',
    fontFamily: Platform.select({ ios: 'SF Pro', default: 'system' }),
  },
});
