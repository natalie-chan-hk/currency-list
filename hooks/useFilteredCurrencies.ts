import { useMemo } from 'react';
import { CurrencyInfo } from '../types/currency';

export const useFilteredCurrencies = (currencies: CurrencyInfo[], searchQuery: string) => {
  return useMemo(() => {
    if (!searchQuery.trim()) return currencies;

    const query = searchQuery.toLowerCase();
    return currencies.filter((currency) => {
      const name = currency.name.toLowerCase();
      const symbol = currency.symbol.toLowerCase();
      return (
        name.startsWith(query) ||
        name.includes(` ${query}`) ||
        symbol.startsWith(query)
      );
    });
  }, [currencies, searchQuery]);
};