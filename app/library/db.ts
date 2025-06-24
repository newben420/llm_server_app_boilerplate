import * as SQLite from 'expo-sqlite';
import { Site } from '../site';
import { Log } from './log';

export const db = SQLite.openDatabaseSync(Site.DB_NAME);

export const dbSetUp = () => new Promise<boolean>((resolve, reject) => {
    db.withExclusiveTransactionAsync(async (txn) => {
        // await txn.execAsync(`DROP TABLE model;`);
        // await txn.execAsync(`CREATE TABLE IF NOT EXISTS session (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, is_dm INTEGER NOT NULL, start TEXT NOT NULL, stop TEXT, intention TEXT);`);
    }).then(r => {
        resolve(true);
    }).catch(err => {
        Log.dev(err);
        resolve(false);
    });
});