import { render, fireEvent, waitFor, act } from '@testing-library/react-native';

import { CRYPTO_CURRENCIES, FIAT_CURRENCIES } from '../src/constants/currency';
import HomePage from '../src/pages/HomePage';
import { StorageService } from '../src/services/storage';

// Mock the navigation
const mockNavigation = {
  navigate: jest.fn(),
};

// Mock the route
const mockRoute = {
  params: {},
};

// Mock the StorageService
jest.mock('../src/services/storage', () => ({
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

  it('should disable only Clear Data and Insert Data buttons during clear data operation', async () => {
    const { getByText, getByTestId } = render(
      <HomePage navigation={mockNavigation as any} route={mockRoute as any} />
    );

    await act(async () => {
      const clearButton = getByText('Clear Data');
      fireEvent.press(clearButton);
    });

    // Check button disabled states and loading indicators
    await waitFor(() => {
      const menuButton0 = getByTestId('menu-button-0'); // Clear Data
      const menuButton1 = getByTestId('menu-button-1'); // Insert Data
      const menuButton2 = getByTestId('menu-button-2'); // Show Crypto
      const menuButton3 = getByTestId('menu-button-3'); // Show Fiat
      const menuButton4 = getByTestId('menu-button-4'); // Show All

      // Clear Data and Insert Data should be disabled
      expect(menuButton0.props.accessibilityState.disabled).toBe(true);
      expect(menuButton1.props.accessibilityState.disabled).toBe(true);

      // Other buttons should remain enabled
      expect(menuButton2.props.accessibilityState.disabled).toBe(false);
      expect(menuButton3.props.accessibilityState.disabled).toBe(false);
      expect(menuButton4.props.accessibilityState.disabled).toBe(false);

      // Only Clear Data should show loading
      expect(getByTestId('loading-indicator')).toBeTruthy();
    });

    // Wait for the operation to complete
    await waitFor(() => {
      expect(StorageService.clearAll).toHaveBeenCalled();
    });

    // Check final state
    await waitFor(() => {
      const menuButton0 = getByTestId('menu-button-0');
      const menuButton1 = getByTestId('menu-button-1');

      // All buttons should be enabled after operation completes
      expect(menuButton0.props.accessibilityState.disabled).toBe(false);
      expect(menuButton1.props.accessibilityState.disabled).toBe(false);
    });
  });

  it('should disable only Clear Data and Insert Data buttons during insert data operation', async () => {
    const { getByText, getByTestId } = render(
      <HomePage navigation={mockNavigation as any} route={mockRoute as any} />
    );

    await act(async () => {
      const insertButton = getByText('Insert Data');
      fireEvent.press(insertButton);
    });

    // Check button disabled states and loading indicators
    await waitFor(() => {
      const menuButton0 = getByTestId('menu-button-0'); // Clear Data
      const menuButton1 = getByTestId('menu-button-1'); // Insert Data
      const menuButton2 = getByTestId('menu-button-2'); // Show Crypto
      const menuButton3 = getByTestId('menu-button-3'); // Show Fiat
      const menuButton4 = getByTestId('menu-button-4'); // Show All

      // Clear Data and Insert Data should be disabled
      expect(menuButton0.props.accessibilityState.disabled).toBe(true);
      expect(menuButton1.props.accessibilityState.disabled).toBe(true);

      // Other buttons should remain enabled
      expect(menuButton2.props.accessibilityState.disabled).toBe(false);
      expect(menuButton3.props.accessibilityState.disabled).toBe(false);
      expect(menuButton4.props.accessibilityState.disabled).toBe(false);

      // Only Insert Data should show loading
      expect(getByTestId('loading-indicator')).toBeTruthy();
    });

    // Wait for the operation to complete
    await waitFor(() => {
      expect(StorageService.setCryptoCurrencies).toHaveBeenCalledWith(CRYPTO_CURRENCIES);
      expect(StorageService.setFiatCurrencies).toHaveBeenCalledWith(FIAT_CURRENCIES);
    });

    // Check final state
    await waitFor(() => {
      const menuButton0 = getByTestId('menu-button-0');
      const menuButton1 = getByTestId('menu-button-1');

      // All buttons should be enabled after operation completes
      expect(menuButton0.props.accessibilityState.disabled).toBe(false);
      expect(menuButton1.props.accessibilityState.disabled).toBe(false);
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

  it('should allow navigation operations while data operations are in progress', async () => {
    const { getByText } = render(
      <HomePage navigation={mockNavigation as any} route={mockRoute as any} />
    );

    // Start clear data operation
    await act(async () => {
      const clearButton = getByText('Clear Data');
      fireEvent.press(clearButton);
    });

    // Should be able to navigate while clear operation is in progress
    await act(async () => {
      const showCryptoButton = getByText('Show Crypto');
      fireEvent.press(showCryptoButton);
    });

    expect(mockNavigation.navigate).toHaveBeenCalledWith('Search', { type: 'crypto' });
  });
});
