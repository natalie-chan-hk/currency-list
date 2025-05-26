import type { StackScreenProps } from '@react-navigation/stack';
import React, { useState, useCallback, useEffect } from 'react';
import { View } from 'react-native';

import { RootStackParamList } from './type';
import SearchableCurrencyList from '../components/SearchableCurrencyList';
import { StorageService } from '../services/storage';
import { CurrencyInfo } from '../types/currency';

type SearchPageProps = StackScreenProps<RootStackParamList, 'Search'>;

const SearchPage = ({ route }: SearchPageProps) => {
  const [currentList, setCurrentList] = useState<CurrencyInfo[]>([]);
  const [selectedCurrency, setSelectedCurrency] = useState<CurrencyInfo | null>(null);

  const handleCurrencyPress = useCallback((currency: CurrencyInfo) => {
    setSelectedCurrency(currency);
  }, []);

  useEffect(() => {
    const loadCurrencies = async () => {
      const { type } = route.params || {};

      try {
        switch (type) {
          case 'crypto': {
            const cryptoList = await StorageService.getCryptoCurrencies();
            setCurrentList(cryptoList);

            break;
          }
          case 'fiat': {
            const fiatList = await StorageService.getFiatCurrencies();
            setCurrentList(fiatList);
            break;
          }
          case 'all':
          default: {
            const [cryptoList, fiatList] = await Promise.all([
              StorageService.getCryptoCurrencies(),
              StorageService.getFiatCurrencies(),
            ]);
            setCurrentList([...cryptoList, ...fiatList]);
            break;
          }
        }
      } catch (error) {
        console.error('Error loading currencies:', error);
        setCurrentList([]);
      }
    };

    loadCurrencies();
  }, [route.params]);

  return (
    <View className="flex-1 bg-white">
      <View className="flex-1">
        <SearchableCurrencyList currencies={currentList} onCurrencyPress={handleCurrencyPress} />
      </View>
    </View>
  );
};

export default SearchPage;
