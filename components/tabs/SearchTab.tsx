import { View } from 'react-native';
import React, { useState, useCallback, useEffect} from 'react';
import type { BottomTabScreenProps, BottomTabBarProps } from '@react-navigation/bottom-tabs';
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
      const { type } = (route.params || {}); 
      
      switch (type) {
        case 'crypto':
          setCurrentList(StorageService.getCryptoCurrencies());
          break;
        case 'fiat':
          setCurrentList(StorageService.getFiatCurrencies());
          break;
        case 'all':
        default:
          const cryptoCurrencies = StorageService.getCryptoCurrencies();
          const fiatCurrencies = StorageService.getFiatCurrencies();
          setCurrentList([...cryptoCurrencies, ...fiatCurrencies]);
          break;
      }
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