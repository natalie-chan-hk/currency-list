import { CurrencyInfo } from '../types/currency';
export const CRYPTO_CURRENCIES: CurrencyInfo[] = [
  { id: 'BTC', name: 'Bitcoin', symbol: 'BTC' },
  { id: 'ETH', name: 'Ethereum', symbol: 'ETH' },
  { id: 'XRP', name: 'XRP', symbol: 'XRP' },
  { id: 'BCH', name: 'Bitcoin Cash', symbol: 'BCH' },
  { id: 'LTC', name: 'Litecoin', symbol: 'LTC' },
  { id: 'EOS', name: 'EOS', symbol: 'EOS' },
  { id: 'BNB', name: 'Binance Coin', symbol: 'BNB' },
  { id: 'LINK', name: 'Chainlink', symbol: 'LINK' },
  { id: 'NEO', name: 'NEO', symbol: 'NEO' },
  { id: 'ETC', name: 'Ethereum Classic', symbol: 'ETC' },
  { id: 'ONT', name: 'Ontology', symbol: 'ONT' },
  { id: 'CRO', name: 'Crypto.com Chain', symbol: 'CRO' },
  { id: 'CUC', name: 'Cucumber', symbol: 'CUC' },
  { id: 'USDC', name: 'USD Coin', symbol: 'USDC' },
];

export const FIAT_CURRENCIES: CurrencyInfo[] = [
  {
    id: 'SGD',
    name: 'Singapore Dollar',
    symbol: '$',
    code: 'SGD',
  },
  {
    id: 'EUR',
    name: 'Euro',
    symbol: '€',
    code: 'EUR',
  },
  {
    id: 'GBP',
    name: 'British Pound',
    symbol: '£',
    code: 'GBP',
  },
  {
    id: 'HKD',
    name: 'Hong Kong Dollar',
    symbol: '$',
    code: 'HKD',
  },
  {
    id: 'JPY',
    name: 'Japanese Yen',
    symbol: '¥',
    code: 'JPY',
  },
  {
    id: 'AUD',
    name: 'Australian Dollar',
    symbol: '$',
    code: 'AUD',
  },
  {
    id: 'USD',
    name: 'United States Dollar',
    symbol: '$',
    code: 'USD',
  },
];
