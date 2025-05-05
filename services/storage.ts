import { MMKV } from 'react-native-mmkv';
import { CurrencyInfo } from '../types/currency';

const storage = new MMKV();

const CRYPTO_CURRENCIES_KEY = 'crypto_currencies';
const FIAT_CURRENCIES_KEY = 'fiat_currencies';

export const StorageService = {
  // Crypto currencies
  setCryptoCurrencies: (currencies: CurrencyInfo[]) => {
    storage.set(CRYPTO_CURRENCIES_KEY, JSON.stringify(currencies));
  },

  getCryptoCurrencies: (): CurrencyInfo[] => {
    const data = storage.getString(CRYPTO_CURRENCIES_KEY);
    return data ? JSON.parse(data) : [];
  },

  // Fiat currencies
  setFiatCurrencies: (currencies: CurrencyInfo[]) => {
    storage.set(FIAT_CURRENCIES_KEY, JSON.stringify(currencies));
  },

  getFiatCurrencies: (): CurrencyInfo[] => {
    const data = storage.getString(FIAT_CURRENCIES_KEY);
    return data ? JSON.parse(data) : [];
  },

  // Clear all data
  clearAll: () => {
    storage.delete(CRYPTO_CURRENCIES_KEY);
    storage.delete(FIAT_CURRENCIES_KEY);
  },
}; 