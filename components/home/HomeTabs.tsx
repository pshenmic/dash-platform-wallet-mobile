import { Tabs } from 'dash-ui-kit/react-native';
import { StyleSheet, useColorScheme, View } from 'react-native';

import { type HomeTab } from '@/types/home';

export interface HomeTabsProps {
  /**
   * Currently active tab
   */
  activeTab: HomeTab;
  /**
   * Callback when tab changes
   */
  onTabChange: (tab: HomeTab) => void;
  /**
   * Optional callback for filter button press
   */
  onFilterPress?: () => void;
  /**
   * Optional content to render for each tab
   */
  children?: {
    tokens?: React.ReactNode;
    names?: React.ReactNode;
    transactions?: React.ReactNode;
  };
}

/**
 * Home screen tabs navigation component
 * 
 * Provides navigation between Tokens, Names, and Transactions tabs.
 * Uses dash-ui-kit Tabs component with custom filter button.
 * 
 * Features:
 * - Three tabs: Tokens, Names, Transactions
 * - Active state with blue underline
 * - Filter button on the right
 * - Theme support (light/dark)
 */
export function HomeTabs({ 
  activeTab, 
  onTabChange, 
  onFilterPress,
  children 
}: HomeTabsProps) {
  const colorScheme = useColorScheme() ?? 'light';

  const tabItems = [
    {
      value: 'tokens' as HomeTab,
      label: 'Tokens',
      content: children?.tokens ?? null,
    },
    {
      value: 'names' as HomeTab,
      label: 'Names',
      content: children?.names ?? null,
    },
    {
      value: 'transactions' as HomeTab,
      label: 'Transactions',
      content: children?.transactions ?? null,
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.tabsWrapper}>
        <View style={styles.tabsContainer}>
          <Tabs
            items={tabItems}
            value={activeTab}
            onValueChange={(value: string) => onTabChange(value as HomeTab)}
            theme={colorScheme}
            size="xl"
            listStyle={styles.tabsList}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  tabsWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    gap: 12,
  },
  tabsContainer: {
    flex: 1,
  },
  tabsList: {
    gap: 24,
  },
  filterButtonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
