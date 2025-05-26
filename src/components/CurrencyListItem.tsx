import { Ionicons } from '@expo/vector-icons';
import { View, Text, TouchableOpacity } from 'react-native';

import { Badge } from './Badge';
import { CurrencyInfo } from '../types/currency';

type CurrencyListItemProps = {
  item: CurrencyInfo;
  onPress?: (currency: CurrencyInfo) => void;
  showSymbol?: boolean;
};

const CurrencyListItem = ({ item, onPress, showSymbol = false }: CurrencyListItemProps) => {
  return (
    <TouchableOpacity
      className="flex-row items-center border-b border-gray-200 p-4"
      onPress={() => onPress?.(item)}
      testID={`currency-list-${item.id}`}>
      <View className="flex-1 flex-row items-center justify-between">
        <View className="flex-row items-center gap-x-4" style={{ flexShrink: 1 }}>
          <Badge title={item?.name?.charAt(0) || '--'} />
          <Text
            className="text-base font-medium"
            numberOfLines={1}
            style={{ flexShrink: 1, maxWidth: '90%' }}>
            {item.name}
          </Text>
        </View>
        {showSymbol && (
          <View className="flex-row items-center gap-x-4">
            <Text className="text-base font-medium">{item.symbol}</Text>
            <Ionicons name="chevron-forward-outline" size={20} color="text-base" />
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default CurrencyListItem;
