import { FontAwesome } from '@expo/vector-icons';
import { useState, useCallback, useMemo, useEffect } from 'react';
import { View, Text, FlatList } from 'react-native';

import CurrencyListItem from './CurrencyListItem';
import CurrencySearchBar from './inputs/CurrencySearchBar';
import { CRYPTO_CURRENCIES } from '../constants/currency';
import { CurrencyInfo } from '../types/currency';

type SearchableCurrencyListProps = {
  currencies: CurrencyInfo[];
  onCurrencyPress?: (currency: CurrencyInfo) => void;
};

const SearchableCurrencyList = ({ currencies, onCurrencyPress }: SearchableCurrencyListProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredCurrencies, setFilteredCurrencies] = useState<CurrencyInfo[]>(currencies);

  // Sync filteredCurrencies with currencies prop when it changes
  useEffect(() => {
    if (!searchQuery) {
      setFilteredCurrencies(currencies);
    }
  }, [currencies, searchQuery]);

  // Create a Set of crypto currency IDs for O(1) lookup
  const cryptoCurrencyIds = useMemo(
    () => new Set(CRYPTO_CURRENCIES.map((crypto) => crypto.id)),
    []
  );

  const renderItem = useCallback(
    ({ item }: { item: CurrencyInfo }) => {
      const isCrypto = cryptoCurrencyIds.has(item.id);
      return <CurrencyListItem item={item} onPress={onCurrencyPress} showSymbol={isCrypto} />;
    },
    [onCurrencyPress, cryptoCurrencyIds]
  );

  const renderEmptyList = useCallback(
    () => (
      <View className="flex-1 items-center justify-center p-5">
        <FontAwesome name="folder-o" size={48} color="text-base text-gray-600" />
        <Text className="text-base text-gray-600">No Results</Text>
        <Text className="text-base text-gray-700">Try "BTC"</Text>
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

export default SearchableCurrencyList;
