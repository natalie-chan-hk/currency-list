import React from 'react';
import { render, fireEvent, act, waitFor } from '@testing-library/react-native';
import CurrencyListFragment from '../components/CurrencyListFragment';
import { CurrencyInfo } from '../types/currency';

// Mock the CurrencySearchBar component since it has its own tests
const mockOnSearchResults = jest.fn();
jest.mock('../components/CurrencySearchBar', () => {
  const { View } = require('react-native');
  return jest.fn(({ onSearchResults, setSearchQuery }) => {
    // Store the onSearchResults callback for later use in tests
    mockOnSearchResults.mockImplementation(onSearchResults);
    return (
      <View
        testID="currency-search-bar"
        onResponderRelease={() => {}}
      />
    );
  });
});

const mockCurrencies: CurrencyInfo[] = [
  { id: 'BTC', name: 'Bitcoin', symbol: 'BTC' },
  { id: 'ETH', name: 'Ethereum', symbol: 'ETH' },
  { id: 'XRP', name: 'XRP', symbol: 'XRP' },
  { id: 'SGD', name: 'Singapore Dollar', symbol: '$', code: 'SGD' },
];

describe('CurrencyListFragment', () => {
  it('renders correctly with currencies', async () => {
    const { getByTestId, getAllByTestId } = render(
      <CurrencyListFragment currencies={mockCurrencies} />
    );

    await waitFor(() => {
      expect(getByTestId('currency-list')).toBeTruthy();
      expect(getByTestId('currency-search-bar')).toBeTruthy();
      expect(getAllByTestId(/currency-list-/)).toHaveLength(mockCurrencies.length);
    });
  });

  it('displays empty state when no currencies are provided', async () => {
    const { getByTestId, getByText } = render(
      <CurrencyListFragment currencies={[]} />
    );

    await waitFor(() => {
      expect(getByTestId('currency-list')).toBeTruthy();
      expect(getByText('No Results')).toBeTruthy();
    });
  });

  it('calls onCurrencyPress when a currency item is pressed', async () => {
    const onCurrencyPress = jest.fn();
    const { getByTestId } = render(
      <CurrencyListFragment
        currencies={mockCurrencies}
        onCurrencyPress={onCurrencyPress}
      />
    );

    await act(async () => {
      const currencyItem = getByTestId('currency-list-BTC');
      fireEvent.press(currencyItem);
    });

    expect(onCurrencyPress).toHaveBeenCalledWith(mockCurrencies[0]);
  });

  it('renders crypto currencies with symbols; fiat currencies without symbols', async () => {
    const { getByTestId, getByText, queryByText } = render(
      <CurrencyListFragment currencies={mockCurrencies} />
    );

    await waitFor(() => {
      const btcItem = getByTestId('currency-list-BTC');
      expect(btcItem).toBeTruthy();
      expect(getByText('BTC')).toBeTruthy();

      const sgdItem = getByTestId('currency-list-SGD');
      expect(sgdItem).toBeTruthy();
      expect(queryByText('$')).toBeNull();
    });
  });

  it('updates filtered currencies when search results change', async () => {
    const { getByTestId, getAllByTestId, getByText, queryByText } = render(
      <CurrencyListFragment currencies={mockCurrencies} />
    );

    await act(async () => {
      // Simulate search results by calling the captured onSearchResults callback
      mockOnSearchResults([{ id: 'BTC', name: 'Bitcoin', symbol: 'BTC' }]);
    });

    await waitFor(() => {
      expect(getAllByTestId(/currency-list-/)).toHaveLength(1);
      expect(getByText('Bitcoin')).toBeTruthy();
      expect(queryByText('Ethereum')).toBeNull();
    });
  });
});