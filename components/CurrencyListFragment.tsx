import React, { useState, useCallback, useMemo, useEffect } from 'react';
import {
  View,
  Text,
  FlatList
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { CurrencyInfo } from '../types/currency';
import CurrencyListItem from './CurrencyListItem';
import { CRYPTO_CURRENCIES } from '../constants/currency';
import CurrencySearchBar from './CurrencySearchBar';

type CurrencyListFragmentProps = {
  currencies: CurrencyInfo[];
  onCurrencyPress?: (currency: CurrencyInfo) => void;
}; 

const CurrencyListFragment = ({
  currencies,
  onCurrencyPress,
}: CurrencyListFragmentProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredCurrencies, setFilteredCurrencies] = useState<CurrencyInfo[]>(currencies);

  // Sync filteredCurrencies with currencies prop when it changes
  useEffect(() => {
    if (!searchQuery) {
      setFilteredCurrencies(currencies);
    }
  }, [currencies, searchQuery]);

  // Create a Set of crypto currency IDs for O(1) lookup
  const cryptoCurrencyIds = useMemo(() => 
    new Set(CRYPTO_CURRENCIES.map(crypto => crypto.id)),
    []
  );

  const renderItem = useCallback(
    ({ item }: { item: CurrencyInfo }) => {
      const isCrypto = cryptoCurrencyIds.has(item.id);
      return (
        <CurrencyListItem 
          item={item} 
          onPress={onCurrencyPress} 
          showSymbol={isCrypto}
        />
      );
    },
    [onCurrencyPress, cryptoCurrencyIds]
  );

  const renderEmptyList = useCallback(
    () => (
      <View className="flex-1 justify-center items-center p-5">
        <FontAwesome
          name="folder-o"
          size={48}
          color="text-base text-gray-600"
        />
        <Text className="text-base text-gray-600">No Results</Text>
        <Text className="text-base text-gray-700">Try {}</Text>
      </View>
    ),
    []
  );

  const handleSearchResults = useCallback((results: CurrencyInfo[]) => {
    setFilteredCurrencies(results);
  }, []);

  return (
    <View className="flex-1 bg-white">
     <CurrencySearchBar 
        currencies={currencies}
        searchQuery={searchQuery} 
        setSearchQuery={setSearchQuery}
        onSearchResults={handleSearchResults}
      />
      <FlatList
        data={filteredCurrencies}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={renderEmptyList}
        contentContainerStyle={{ flexGrow: 1 }}
        testID="currency-list"
      />
    </View>
  );
}; 

export default CurrencyListFragment;