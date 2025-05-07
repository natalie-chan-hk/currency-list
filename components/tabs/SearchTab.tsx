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
  
    const handleCurrencyPress = useCallback((currency: CurrencyInfo) => {
      setSelectedCurrency(currency);
    }, []);
  
    useEffect(() => {
      const loadCurrencies = async () => {
        const { type } = (route.params || {}); 
        
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
                StorageService.getFiatCurrencies()
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
          <CurrencyListFragment
            currencies={currentList}
            onCurrencyPress={handleCurrencyPress}
          />
        </View>
      </View>
    );
  };

export default SearchTab;