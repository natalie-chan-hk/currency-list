import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { CurrencyListFragment } from '../components/CurrencyListFragment';
import { CurrencyInfo } from '../types/currency';

const mockCurrencies: CurrencyInfo[] = [
  { id: 'BTC', name: 'Bitcoin', symbol: 'BTC' },
  { id: 'ETH', name: 'Ethereum', symbol: 'ETH' },
  { id: 'ETC', name: 'Ethereum Classic', symbol: 'ETC' },
];

describe('CurrencyListFragment', () => {
  it('renders all currencies when no search query', () => {
    const { getAllByText } = render(
      <CurrencyListFragment currencies={mockCurrencies} />
    );

    expect(getAllByText(/Bitcoin|Ethereum|Ethereum Classic/)).toHaveLength(3);
  });

  it('filters currencies based on name prefix', () => {
    const { getByPlaceholderText, getAllByText } = render(
      <CurrencyListFragment currencies={mockCurrencies} />
    );

    const searchInput = getByPlaceholderText('Search currencies...');
    fireEvent.changeText(searchInput, 'Eth');

    expect(getAllByText(/Ethereum|Ethereum Classic/)).toHaveLength(2);
  });

  it('filters currencies based on symbol prefix', () => {
    const { getByPlaceholderText, getAllByText } = render(
      <CurrencyListFragment currencies={mockCurrencies} />
    );

    const searchInput = getByPlaceholderText('Search currencies...');
    fireEvent.changeText(searchInput, 'ET');

    expect(getAllByText(/Ethereum|Ethereum Classic/)).toHaveLength(2);
  });

  it('shows empty state when no matches found', () => {
    const { getByPlaceholderText, getByText } = render(
      <CurrencyListFragment currencies={mockCurrencies} />
    );

    const searchInput = getByPlaceholderText('Search currencies...');
    fireEvent.changeText(searchInput, 'XYZ');

    expect(getByText('No Results')).toBeTruthy();
  });

  it('calls onCurrencyPress when currency is pressed', () => {
    const onCurrencyPress = jest.fn();
    const { getByText } = render(
      <CurrencyListFragment
        currencies={mockCurrencies}
        onCurrencyPress={onCurrencyPress}
      />
    );

    fireEvent.press(getByText('Bitcoin'));
    expect(onCurrencyPress).toHaveBeenCalledWith(mockCurrencies[0]);
  });

  it('clears search when clear button is pressed', () => {
    const { getByPlaceholderText, getByText, getAllByText } = render(
      <CurrencyListFragment currencies={mockCurrencies} />
    );

    const searchInput = getByPlaceholderText('Search currencies...');
    fireEvent.changeText(searchInput, 'Eth');
    expect(getAllByText(/Ethereum|Ethereum Classic/)).toHaveLength(2);

    const clearButton = getByText('✕');
    fireEvent.press(clearButton);
    expect(getAllByText(/Bitcoin|Ethereum|Ethereum Classic/)).toHaveLength(3);
  });
}); 