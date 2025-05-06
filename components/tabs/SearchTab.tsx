import { View } from 'react-native';
import React, { useState, useCallback, useEffect} from 'react';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { CurrencyInfo } from '../../types/currency';
import { StorageService } from '../../services/storage';
import CurrencyListFragment from '../CurrencyListFragment';
import { RootTabParamList } from './type';

type SearchTabProps = BottomTabScreenProps<RootTabParamList, 'Search'>;

const SearchTab = ({ route }: SearchTabProps) => {
  const [currentList, setCurrentList] = useState<CurrencyInfo[]>([]);
  const [selectedCurrency, setSelectedCurrency] = useState<CurrencyInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const handleCurrencyPress = useCallback((currency: CurrencyInfo) => {
    setSelectedCurrency(currency);
  }, []);

  const loadCurrencies = useCallback(async () => {
    setIsLoading(true);
    try {
      const { type } = (route.params || {}); 
      
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
    } finally {
      setIsLoading(false);
    }
  }, [route.params]);

  // Listen for data changes
  useEffect(() => {
    const unsubscribe = StorageService.subscribe(() => {
      // Only reload if the current type is 'all' or matches the current view
      const { type } = (route.params || {});
      if (type === 'all' || type === 'crypto' || type === 'fiat') {
        loadCurrencies();
      }
    });

    return () => {
      unsubscribe();
    };
  }, [route.params, loadCurrencies]);

  // Initial load
  useEffect(() => {
    loadCurrencies();
  }, [loadCurrencies]);

  return (
    <View className="flex-1 bg-white">
      <CurrencyListFragment
        currencies={currentList}
        onCurrencyPress={handleCurrencyPress}
        isLoading={isLoading}
      />
    </View>
  );
};

export default SearchTab;