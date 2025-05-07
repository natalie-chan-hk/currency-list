import React, { useState, useCallback } from 'react';
import { View, ScrollView, ActivityIndicator } from 'react-native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { RootTabParamList } from './type';
import { MenuButton } from '../buttons/MenuButton';
import { StorageService } from '../../services/storage';
import { CRYPTO_CURRENCIES, FIAT_CURRENCIES } from '../../constants/currency';
import Toast, { ToastProps } from '../Toast';
 
type HomeTabProps = BottomTabScreenProps<RootTabParamList, 'Home'>;

const HomeTab = ({ navigation }: HomeTabProps) => {
  const [toast, setToast] = useState<ToastProps | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleClearData = useCallback(async () => {
    try {
      setIsLoading(true);
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
      setIsLoading(false);
    }
  }, []);

  const handleInsertData = useCallback(async () => {
    try {
      setIsLoading(true);
      await Promise.all([
        StorageService.setCryptoCurrencies(CRYPTO_CURRENCIES),
        StorageService.setFiatCurrencies(FIAT_CURRENCIES)
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
      setIsLoading(false);
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
      disabled: isLoading,
    },
    {
      title: 'Insert Data',
      onPress: handleInsertData,
      disabled: isLoading,
    },
    {
      title: 'Show Crypto',
      onPress: handleShowCrypto,
      disabled: isLoading,
    },
    {
      title: 'Show Fiat',
      onPress: handleShowFiat,
      disabled: isLoading,
    },
    {
      title: 'Show All',
      onPress: handleShowAll,
      disabled: isLoading,
    },
  ];

  const hideToast = () => {
    setToast(null);
  };

  return (
    <View className="flex-1 bg-white">
      <ScrollView className="flex-1 bg-white">
        {isLoading && (
          <View className="absolute inset-0 bg-black/10 z-10 items-center justify-center">
            <ActivityIndicator size="large" color="#0000ff" testID="loading-indicator"/>
          </View>
        )}
      <View className="p-4">
        {menu.map((item, index) => (
          <MenuButton
            key={index}
            title={item.title}
            onPress={item.onPress}
            disabled={item.disabled}
            testID={`menu-button-${index}`}
          />
        ))}
      </View>
      </ScrollView>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onHide={hideToast}
        />
      )}
    </View>
  );
};

export default HomeTab;