import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { CurrencyInfo } from '../types/currency';
import { Badge } from './Badge';
import { Ionicons } from '@expo/vector-icons';

type CurrencyListItemProps = {
  item: CurrencyInfo;
  onPress?: (currency: CurrencyInfo) => void;
  showSymbol?: boolean;
};

const CurrencyListItem = ({
  item,
  onPress,
  showSymbol = false,
}: CurrencyListItemProps) => {
  return (
    <TouchableOpacity
      className="flex-row items-center p-4 border-b border-gray-200"
      onPress={() => onPress?.(item)}
      testID={`currency-list-${item.id}`}
    >
      <View className="flex-1 flex-row items-center justify-between">
        <View className="flex-row items-center space-x-4">
          <Badge title={item.name.charAt(0)} />
          <Text className="text-base font-medium">{item.name}</Text>
        </View>
        {showSymbol && (
            <View className="flex-row items-center space-x-4">
            <Text className="text-base font-medium mr-2">{item.symbol}</Text>
            <Ionicons
              name="chevron-forward-outline"
              size={20}
              color="text-base"
            />
            </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default CurrencyListItem;