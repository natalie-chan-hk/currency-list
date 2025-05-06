import { Database } from '@nozbe/watermelondb';
import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite';
import schema from './schema';
import Currency from './models/Currency';

const adapter = new SQLiteAdapter({
  schema,
  // Optional database name
  dbName: 'currencyDB',
});

export const database = new Database({
  adapter,
  modelClasses: [Currency],
});

// Helper functions to convert between Currency model and CurrencyInfo type
export const currencyToInfo = (currency: Currency) => ({
  id: currency.id,
  name: currency.name,
  symbol: currency.symbol,
});

export const infoToCurrency = (info: { name: string; symbol: string; type: 'crypto' | 'fiat' }) => ({
  name: info.name,
  symbol: info.symbol,
  type: info.type,
}); 