import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import HomePage from '../components/pages/HomePage';
import { StorageService } from '../services/storage';
import { CRYPTO_CURRENCIES, FIAT_CURRENCIES } from '../constants/currency';

// Mock the navigation
const mockNavigation = {
  navigate: jest.fn(),
};

// Mock the route
const mockRoute = {
  params: {},
};

// Mock the StorageService
jest.mock('../services/storage', () => ({
  StorageService: {
    clearAll: jest
      .fn()
      .mockImplementation(() => new Promise((resolve) => setTimeout(resolve, 100))),
    setCryptoCurrencies: jest
      .fn()
      .mockImplementation(() => new Promise((resolve) => setTimeout(resolve, 100))),
    setFiatCurrencies: jest
      .fn()
      .mockImplementation(() => new Promise((resolve) => setTimeout(resolve, 100))),
  },
}));

describe('HomePage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.clearAllMocks();
  });

  it('1-should show loading state and disable buttons during clear data operation', async () => {
    const { getByText, queryByTestId, getByTestId, findByTestId } = render(
      <HomePage navigation={mockNavigation as any} route={mockRoute as any} />
    );

    await act(async () => {
      const clearButton = getByText('Clear Data');
      fireEvent.press(clearButton);
    });

    // Wait for the loading state to appear
    await waitFor(() => {
      const loadingIndicator = queryByTestId('loading-indicator');
      expect(loadingIndicator).toBeTruthy();
    });

    // Check button disabled states by verifying accessibilityState.disabled
    await waitFor(() => {
      expect(getByTestId('menu-button-0').props.accessibilityState.disabled).toBe(true);
      expect(getByTestId('menu-button-1').props.accessibilityState.disabled).toBe(true);
      expect(getByTestId('menu-button-2').props.accessibilityState.disabled).toBe(true);
      expect(getByTestId('menu-button-3').props.accessibilityState.disabled).toBe(true);
      expect(getByTestId('menu-button-4').props.accessibilityState.disabled).toBe(true);
    });

    // Wait for the operation to complete
    await waitFor(() => {
      expect(StorageService.clearAll).toHaveBeenCalled();
    });

    // Check final state
    await waitFor(() => {
      expect(queryByTestId('loading-indicator')).toBeNull();
      expect(queryByTestId('menu-button-0').props.accessibilityState.disabled).toBe(false);
      expect(queryByTestId('menu-button-1').props.accessibilityState.disabled).toBe(false);
      expect(queryByTestId('menu-button-2').props.accessibilityState.disabled).toBe(false);
      expect(queryByTestId('menu-button-3').props.accessibilityState.disabled).toBe(false);
      expect(queryByTestId('menu-button-4').props.accessibilityState.disabled).toBe(false);
    });
  });

  it('2-should show loading state and disable buttons during insert data operation', async () => {
    const { getByText, queryByTestId, getByTestId } = render(
      <HomePage navigation={mockNavigation as any} route={mockRoute as any} />
    );

    await act(async () => {
      const insertButton = getByText('Insert Data');
      fireEvent.press(insertButton);
    });

    // Wait for the loading state to appear
    await waitFor(() => {
      const loadingIndicator = queryByTestId('loading-indicator');
      expect(loadingIndicator).toBeTruthy();
    });

    // Check button disabled states
    await waitFor(() => {
      expect(getByTestId('menu-button-0').props.accessibilityState.disabled).toBe(true);
      expect(getByTestId('menu-button-1').props.accessibilityState.disabled).toBe(true);
      expect(getByTestId('menu-button-2').props.accessibilityState.disabled).toBe(true);
      expect(getByTestId('menu-button-3').props.accessibilityState.disabled).toBe(true);
      expect(getByTestId('menu-button-4').props.accessibilityState.disabled).toBe(true);
    });

    // Wait for the operation to complete
    await waitFor(() => {
      expect(StorageService.setCryptoCurrencies).toHaveBeenCalledWith(CRYPTO_CURRENCIES);
      expect(StorageService.setFiatCurrencies).toHaveBeenCalledWith(FIAT_CURRENCIES);
    });

    // Check final state
    await waitFor(() => {
      expect(queryByTestId('loading-indicator')).toBeNull();
      expect(queryByTestId('menu-button-0').props.accessibilityState.disabled).toBe(false);
      expect(queryByTestId('menu-button-1').props.accessibilityState.disabled).toBe(false);
      expect(queryByTestId('menu-button-2').props.accessibilityState.disabled).toBe(false);
      expect(queryByTestId('menu-button-3').props.accessibilityState.disabled).toBe(false);
      expect(queryByTestId('menu-button-4').props.accessibilityState.disabled).toBe(false);
    });
  });

  it('should show success toast after successful clear data operation', async () => {
    const { getByText, findByText } = render(
      <HomePage navigation={mockNavigation as any} route={mockRoute as any} />
    );

    await act(async () => {
      const clearButton = getByText('Clear Data');
      fireEvent.press(clearButton);
    });

    // Wait for success toast
    await waitFor(async () => {
      const toast = await findByText('Data cleared successfully');
      expect(toast).toBeTruthy();
    });
  });

  it('should show success toast after successful insert data operation', async () => {
    const { getByText, findByText } = render(
      <HomePage navigation={mockNavigation as any} route={mockRoute as any} />
    );

    await act(async () => {
      const insertButton = getByText('Insert Data');
      fireEvent.press(insertButton);
    });

    // Wait for success toast
    await waitFor(async () => {
      const toast = await findByText('Data inserted successfully');
      expect(toast).toBeTruthy();
    });
  });

  it('should show error toast when clear data operation fails', async () => {
    // Mock the clearAll function to throw an error
    (StorageService.clearAll as jest.Mock).mockRejectedValueOnce(new Error('Clear failed'));

    const { getByText, findByText } = render(
      <HomePage navigation={mockNavigation as any} route={mockRoute as any} />
    );

    await act(async () => {
      const clearButton = getByText('Clear Data');
      fireEvent.press(clearButton);
    });

    // Wait for error toast
    await waitFor(async () => {
      const toast = await findByText('Failed to clear data');
      expect(toast).toBeTruthy();
    });
  });

  it('should show error toast when insert data operation fails', async () => {
    // Mock the setCryptoCurrencies function to throw an error
    (StorageService.setCryptoCurrencies as jest.Mock).mockRejectedValueOnce(
      new Error('Insert failed')
    );

    const { getByText, findByText } = render(
      <HomePage navigation={mockNavigation as any} route={mockRoute as any} />
    );

    await act(async () => {
      const insertButton = getByText('Insert Data');
      fireEvent.press(insertButton);
    });

    // Wait for error toast
    await waitFor(async () => {
      const toast = await findByText('Failed to insert data');
      expect(toast).toBeTruthy();
    });
  });

  it('should navigate to Search screen with correct type when Show Crypto is pressed', async () => {
    const { getByText } = render(
      <HomePage navigation={mockNavigation as any} route={mockRoute as any} />
    );

    await act(async () => {
      const showCryptoButton = getByText('Show Crypto');
      fireEvent.press(showCryptoButton);
    });

    expect(mockNavigation.navigate).toHaveBeenCalledWith('Search', { type: 'crypto' });
  });

  it('should navigate to Search screen with correct type when Show Fiat is pressed', async () => {
    const { getByText } = render(
      <HomePage navigation={mockNavigation as any} route={mockRoute as any} />
    );

    await act(async () => {
      const showFiatButton = getByText('Show Fiat');
      fireEvent.press(showFiatButton);
    });

    expect(mockNavigation.navigate).toHaveBeenCalledWith('Search', { type: 'fiat' });
  });

  it('should navigate to Search screen with correct type when Show All is pressed', async () => {
    const { getByText } = render(
      <HomePage navigation={mockNavigation as any} route={mockRoute as any} />
    );

    await act(async () => {
      const showAllButton = getByText('Show All');
      fireEvent.press(showAllButton);
    });

    expect(mockNavigation.navigate).toHaveBeenCalledWith('Search', { type: 'all' });
  });
});
