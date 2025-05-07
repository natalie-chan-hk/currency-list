import React from 'react';
import { render, fireEvent, act } from '@testing-library/react-native';
import CurrencySearchBar from '../components/CurrencySearchBar';
import { CurrencyInfo } from '../types/currency';

// Mock @expo/vector-icons
jest.mock('@expo/vector-icons', () => ({
  Ionicons: () => null,
}));

// Mock react-native-reanimated
jest.mock('react-native-reanimated', () => {
  const View = require('react-native').View;
  return {
    View,
    useSharedValue: jest.fn(() => ({
      value: 0,
    })),
    useAnimatedStyle: jest.fn(() => ({})),
    withTiming: jest.fn((toValue) => toValue),
  };
});

describe('CurrencySearchBar', () => {
  const mockCurrencies: CurrencyInfo[] = [
    { id: 'USD', name: 'US Dollar', symbol: '$' },
    { id: 'EUR', name: 'Euro', symbol: '€' },
  ];

  const defaultProps = {
    currencies: mockCurrencies,
    searchQuery: '',
    setSearchQuery: jest.fn(),
    onSearchResults: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly with initial state', () => {
    const { getByPlaceholderText } = render(<CurrencySearchBar {...defaultProps} />);
    expect(getByPlaceholderText('Search currency')).toBeTruthy();
  });

  it('handles search input changes', () => {
    const { getByPlaceholderText } = render(<CurrencySearchBar {...defaultProps} />);
    const input = getByPlaceholderText('Search currency');
    
    act(() => {
      fireEvent.changeText(input, 'USD');
    });
    
    expect(defaultProps.setSearchQuery).toHaveBeenCalledWith('USD');
    expect(defaultProps.onSearchResults).toHaveBeenCalled();
  });

  it('clears search when arrow back button is pressed', async () => {
    const { getByTestId, getByPlaceholderText } = render(
      <CurrencySearchBar {...defaultProps} searchQuery="USD" />
    );
    
    const input = getByPlaceholderText('Search currency');
    
    // Focus the input first to show the buttons
    act(() => {
      fireEvent(input, 'focus');
    });
    
    await act(async () => {
      const arrowBackButton = getByTestId('arrow-back-button');
      fireEvent.press(arrowBackButton);
    });
    
    expect(defaultProps.setSearchQuery).toHaveBeenCalledWith('');
    expect(defaultProps.onSearchResults).toHaveBeenCalledWith(mockCurrencies);
  });

  it('clears search when close button is pressed', async () => {
    const { getByTestId, getByPlaceholderText } = render(
      <CurrencySearchBar {...defaultProps} searchQuery="USD" />
    );
    
    const input = getByPlaceholderText('Search currency');
    
    // Focus the input first to show the buttons
    act(() => {
      fireEvent(input, 'focus');
    });
    
    await act(async () => {
      const closeButton = getByTestId('close-button');
      fireEvent.press(closeButton);
    });
    
    expect(defaultProps.setSearchQuery).toHaveBeenCalledWith('');
    expect(defaultProps.onSearchResults).toHaveBeenCalledWith(mockCurrencies);
  });

  it('shows/hides buttons based on focus state', async () => {
    const { getByPlaceholderText, queryByTestId } = render(
      <CurrencySearchBar {...defaultProps} />
    );
    
    const input = getByPlaceholderText('Search currency');
    
    // Initially, buttons should not be visible
    expect(queryByTestId('arrow-back-button')).toBeNull();
    expect(queryByTestId('close-button')).toBeNull();
    
    // Focus the input
    await act(async () => {
      fireEvent(input, 'focus');
    });
    
    // Buttons should be visible
    expect(queryByTestId('arrow-back-button')).toBeTruthy();
    expect(queryByTestId('close-button')).toBeTruthy();
    
    // Blur the input
    await act(async () => {
      fireEvent(input, 'blur');
    });
    
    // Buttons should be hidden again
    expect(queryByTestId('arrow-back-button')).toBeNull();
    expect(queryByTestId('close-button')).toBeNull();
  });
}); 