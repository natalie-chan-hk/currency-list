import * as SQLite from 'expo-sqlite';

import { CurrencyInfo } from '../types/currency';

const db = SQLite.openDatabaseSync('currencies.db');

// Initialize database tables
const initDatabase = () => {
  db.execSync(`
    CREATE TABLE IF NOT EXISTS crypto_currencies (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      symbol TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS fiat_currencies (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      symbol TEXT NOT NULL,
      code TEXT
    );
  `);
};

// Initialize database on first load
initDatabase();

export const StorageService = {
  // Crypto currencies
  setCryptoCurrencies: async (currencies: CurrencyInfo[]): Promise<void> => {
    db.withTransactionSync(() => {
      db.execSync('DELETE FROM crypto_currencies');
      currencies.forEach((currency) => {
        db.runSync('INSERT INTO crypto_currencies (id, name, symbol) VALUES (?, ?, ?)', [
          currency.id,
          currency.name,
          currency.symbol,
        ]);
      });
    });
  },

  getCryptoCurrencies: async (): Promise<CurrencyInfo[]> => {
    return db.getAllSync<CurrencyInfo>('SELECT * FROM crypto_currencies');
  },

  // Fiat currencies
  setFiatCurrencies: async (currencies: CurrencyInfo[]): Promise<void> => {
    db.withTransactionSync(() => {
      db.execSync('DELETE FROM fiat_currencies');
      currencies.forEach((currency) => {
        const params = [currency.id, currency.name, currency.symbol];
        if (currency.code) {
          params.push(currency.code);
        }
        db.runSync(
          'INSERT INTO fiat_currencies (id, name, symbol, code) VALUES (?, ?, ?, ?)',
          params
        );
      });
    });
  },

  getFiatCurrencies: async (): Promise<CurrencyInfo[]> => {
    return db.getAllSync<CurrencyInfo>('SELECT * FROM fiat_currencies');
  },

  // Clear all data
  clearAll: async (): Promise<void> => {
    db.withTransactionSync(() => {
      db.execSync('DELETE FROM crypto_currencies');
      db.execSync('DELETE FROM fiat_currencies');
    });
  },
};
