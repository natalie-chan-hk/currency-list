import { database, currencyToInfo, infoToCurrency } from '../database';
import { CurrencyInfo } from '../types/currency';
import { CRYPTO_CURRENCIES, FIAT_CURRENCIES } from '../constants/currency';
import { Q } from '@nozbe/watermelondb';
import Currency from '../database/models/Currency';

type Subscriber = () => void;

class StorageService {
  private static subscribers: Subscriber[] = [];

  static subscribe(callback: Subscriber): () => void {
    this.subscribers.push(callback);
    return () => {
      this.subscribers = this.subscribers.filter(sub => sub !== callback);
    };
  }

  private static notifySubscribers() {
    this.subscribers.forEach(subscriber => subscriber());
  }

  static async setCryptoCurrencies(currencies: CurrencyInfo[]): Promise<void> {
    try {
      await database.write(async () => {
        // Clear existing crypto currencies
        const existingCrypto = await database.get<Currency>('currencies').query(
          Q.where('type', 'crypto')
        ).fetch();
        await database.batch(
          ...existingCrypto.map(currency => currency.destroyPermanently())
        );

        // Add new crypto currencies
        await database.batch(
          ...currencies.map(currency => 
            database.get<Currency>('currencies').create(record => {
              Object.assign(record, infoToCurrency({ ...currency, type: 'crypto' }));
            })
          )
        );
      });
      this.notifySubscribers();
    } catch (error) {
      console.error('Error saving crypto currencies:', error);
      throw error;
    }
  }

  static async getCryptoCurrencies(): Promise<CurrencyInfo[]> {
    try {
      const currencies = await database.get<Currency>('currencies')
        .query(Q.where('type', 'crypto'))
        .fetch();
      return currencies.map(currencyToInfo);
    } catch (error) {
      console.error('Error getting crypto currencies:', error);
      return [];
    }
  }

  static async setFiatCurrencies(currencies: CurrencyInfo[]): Promise<void> {
    try {
      await database.write(async () => {
        // Clear existing fiat currencies
        const existingFiat = await database.get<Currency>('currencies').query(
          Q.where('type', 'fiat')
        ).fetch();
        await database.batch(
          ...existingFiat.map(currency => currency.destroyPermanently())
        );

        // Add new fiat currencies
        await database.batch(
          ...currencies.map(currency => 
            database.get<Currency>('currencies').create(record => {
              Object.assign(record, infoToCurrency({ ...currency, type: 'fiat' }));
            })
          )
        );
      });
      this.notifySubscribers();
    } catch (error) {
      console.error('Error saving fiat currencies:', error);
      throw error;
    }
  }

  static async getFiatCurrencies(): Promise<CurrencyInfo[]> {
    try {
      const currencies = await database.get<Currency>('currencies')
        .query(Q.where('type', 'fiat'))
        .fetch();
      return currencies.map(currencyToInfo);
    } catch (error) {
      console.error('Error getting fiat currencies:', error);
      return [];
    }
  }

  static async clearAll(): Promise<void> {
    try {
      await database.write(async () => {
        const allCurrencies = await database.get<Currency>('currencies').query().fetch();
        await database.batch(
          ...allCurrencies.map(currency => currency.destroyPermanently())
        );
      });
      this.notifySubscribers();
    } catch (error) {
      console.error('Error clearing storage:', error);
      throw error;
    }
  }

  static async initializeData(): Promise<void> {
    try {
      await this.setCryptoCurrencies(CRYPTO_CURRENCIES);
      await this.setFiatCurrencies(FIAT_CURRENCIES);
    } catch (error) {
      console.error('Error initializing data:', error);
      throw error;
    }
  }
}

export { StorageService }; 