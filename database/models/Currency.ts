import { Model } from '@nozbe/watermelondb';
import { field, date } from '@nozbe/watermelondb/decorators';

export default class Currency extends Model {
  static table = 'currencies';

  @field('name') name!: string;
  @field('symbol') symbol!: string;
  @field('type') type!: 'crypto' | 'fiat';
  @date('created_at') createdAt!: Date;
  @date('updated_at') updatedAt!: Date;
} 