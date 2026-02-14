import { useThemeColor } from '@/hooks/use-theme-color';
import { type TransactionType } from '@/types/transaction';
import { Ionicons } from '@expo/vector-icons';

export interface TransactionIconProps {
  /**
   * Transaction type determines the icon and color
   */
  type: TransactionType;
  /**
   * Icon size (default: 24)
   */
  size?: number;
}

/**
 * Transaction icon component
 * 
 * Displays an icon based on transaction type:
 * - Receive: checkmark-circle (green tint)
 * - Send: arrow-up-circle (red tint)
 * - Documents Batch: document-text (gray)
 */
export function TransactionIcon({ type, size = 24 }: TransactionIconProps) {
  const iconColor = useThemeColor({}, 'icon');

  const getIconConfig = () => {
    switch (type) {
      case 'receive':
        return {
          name: 'checkmark-circle' as const,
          color: '#10B981', // Green
        };
      case 'send':
        return {
          name: 'arrow-up-circle' as const,
          color: '#EF4444', // Red
        };
      case 'documents_batch':
        return {
          name: 'document-text' as const,
          color: iconColor,
        };
    }
  };

  const config = getIconConfig();

  return <Ionicons name={config.name} size={size} color={config.color} />;
}
