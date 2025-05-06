import { appSchema, tableSchema } from '@nozbe/watermelondb';

export default appSchema({
  version: 1,
  tables: [
    tableSchema({
      name: 'currencies',
      columns: [
        { name: 'name', type: 'string' },
        { name: 'symbol', type: 'string' },
        { name: 'type', type: 'string' }, // 'crypto' or 'fiat'
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
      ],
    }),
  ],
}); 