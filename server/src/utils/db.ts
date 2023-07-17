import { LowSync } from 'lowdb';
import { JSONFileSync } from 'lowdb/node';
import { ISong } from '../interfaces/ISong';
import lodash from 'lodash';

interface IDatabase {
  songs: ISong[];
}
// Extend Low class with a new `chain` field
export class LowWithLodash<T> extends LowSync<T> {
  chain: lodash.ExpChain<this['data']> = lodash.chain(this).get('data');
}

const adapter = new JSONFileSync<IDatabase>('db.json');
export const database = new LowWithLodash(adapter, { songs: [] });

database.read();
database.write();
