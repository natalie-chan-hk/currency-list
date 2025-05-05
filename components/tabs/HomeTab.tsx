import React, { useState, useCallback } from 'react';
import { View, ScrollView } from 'react-native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { RootTabParamList } from './type';
import { MenuButton } from '../buttons/MenuButton';
import { StorageService } from '../../services/storage';
import { CRYPTO_CURRENCIES, FIAT_CURRENCIES } from '../../constants/currency';
import Toast from '../Toast';
import {ToastProps} from '../Toast';
 
type HomeTabProps = BottomTabScreenProps<RootTabParamList, 'Home'>;

const HomeTab = ({ navigation }: HomeTabProps) => {
  const [toast, setToast] = useState<ToastProps | null>(null);

  const handleClearData = useCallback(() => {
    try {
      StorageService.clearAll();
      setToast({
        message: 'Data cleared successfully',
        type: 'success',
      });
    } catch (error) {
      setToast({
        message: 'Failed to clear data',
        type: 'error',
      });
    }
  }, []);

  const handleInsertData = useCallback(() => {
    try {
      StorageService.setCryptoCurrencies(CRYPTO_CURRENCIES);
      StorageService.setFiatCurrencies(FIAT_CURRENCIES);
      setToast({
        message: 'Data inserted successfully',
        type: 'success',
      });
    } catch (error) {
      setToast({
        message: 'Failed to insert data',
        type: 'error',
      });
    }
  }, []);

  const handleShowCrypto = useCallback(() => {
    navigation.navigate('Search', { type: 'crypto' });
  }, [navigation]);

  const handleShowFiat = useCallback(() => {
    navigation.navigate('Search', { type: 'fiat' });
  }, [navigation]);

  const handleShowAll = useCallback(() => {
    navigation.navigate('Search', { type: 'all' });
  }, [navigation]);

  const menu = [
    {
      title: 'Clear Data',
      onPress: handleClearData,
    },
    {
      title: 'Insert Data',
      onPress: handleInsertData,
    },
    {
      title: 'Show Crypto',
      onPress: handleShowCrypto,
    },
    {
      title: 'Show Fiat',
      onPress: handleShowFiat,
    },
    {
      title: 'Show All',
      onPress: handleShowAll,
    },
  ];

  return (
    <View className="flex-1 bg-white">
      <ScrollView className="flex-1">
        <View className="p-4">
          {menu.map((item) => (
            <MenuButton
              key={item.title}
              title={item.title}
              onPress={item.onPress}
            />
          ))}
        </View>
      </ScrollView>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onHide={() => setToast(null)}
        />
      )}
    </View>
  );
};

export default HomeTab;