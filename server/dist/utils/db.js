import { LowSync } from 'lowdb';
import { JSONFileSync } from 'lowdb/node';
import lodash from 'lodash';
// Extend Low class with a new `chain` field
export class LowWithLodash extends LowSync {
    constructor() {
        super(...arguments);
        this.chain = lodash.chain(this).get('data');
    }
}
const adapter = new JSONFileSync('db.json');
export const database = new LowWithLodash(adapter, { songs: [] });
database.read();
database.write();
