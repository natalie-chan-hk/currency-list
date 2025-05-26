import type { StackScreenProps } from '@react-navigation/stack';
import React, { useState, useCallback } from 'react';
import { View, ScrollView } from 'react-native';

import { RootStackParamList } from './type';
import Toast, { ToastProps } from '../components/Toast';
import { MenuButton } from '../components/buttons/MenuButton';
import { CRYPTO_CURRENCIES, FIAT_CURRENCIES } from '../constants/currency';
import { StorageService } from '../services/storage';

type HomePageProps = StackScreenProps<RootStackParamList, 'Home'>;

type LoadingStates = {
  clearData: boolean;
  insertData: boolean;
  showCrypto: boolean;
  showFiat: boolean;
  showAll: boolean;
};

const HomePage = ({ navigation }: HomePageProps) => {
  const [toast, setToast] = useState<ToastProps | null>(null);
  const [loadingStates, setLoadingStates] = useState<LoadingStates>({
    clearData: false,
    insertData: false,
    showCrypto: false,
    showFiat: false,
    showAll: false,
  });

  const setLoadingState = (key: keyof LoadingStates, value: boolean) => {
    setLoadingStates(prev => ({ ...prev, [key]: value }));
  };

  const handleClearData = useCallback(async () => {
    try {
      setLoadingState('clearData', true);
      await StorageService.clearAll();
      setToast({
        message: 'Data cleared successfully',
        type: 'success',
      });
    } catch (error) {
      setToast({
        message: 'Failed to clear data',
        type: 'error',
      });
    } finally {
      setLoadingState('clearData', false);
    }
  }, []);

  const handleInsertData = useCallback(async () => {
    try {
      setLoadingState('insertData', true);
      await Promise.all([
        StorageService.setCryptoCurrencies(CRYPTO_CURRENCIES),
        StorageService.setFiatCurrencies(FIAT_CURRENCIES),
      ]);
      setToast({
        message: 'Data inserted successfully',
        type: 'success',
      });
    } catch (error) {
      setToast({
        message: 'Failed to insert data',
        type: 'error',
      });
    } finally {
      setLoadingState('insertData', false);
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
      disabled: loadingStates.clearData || loadingStates.insertData,
      isLoading: loadingStates.clearData,
    },
    {
      title: 'Insert Data',
      onPress: handleInsertData,
      disabled: loadingStates.clearData || loadingStates.insertData,
      isLoading: loadingStates.insertData,
    },
    {
      title: 'Show Crypto',
      onPress: handleShowCrypto,
      disabled: loadingStates.showCrypto,
      isLoading: loadingStates.showCrypto,
    },
    {
      title: 'Show Fiat',
      onPress: handleShowFiat,
      disabled: loadingStates.showFiat,
      isLoading: loadingStates.showFiat,
    },
    {
      title: 'Show All',
      onPress: handleShowAll,
      disabled: loadingStates.showAll,
      isLoading: loadingStates.showAll,
    },
  ];

  const hideToast = () => {
    setToast(null);
  };

  return (
    <View className="flex-1 bg-white">
      <ScrollView className="flex-1 bg-white">
        <View className="p-4">
          {menu.map((item, index) => (
            <MenuButton
              key={index}
              title={item.title}
              onPress={item.onPress}
              disabled={item.disabled}
              isLoading={item.isLoading}
              testID={`menu-button-${index}`}
            />
          ))}
        </View>
      </ScrollView>
      {toast && <Toast message={toast.message} type={toast.type} onHide={hideToast} />}
    </View>
  );
};

export default HomePage;
