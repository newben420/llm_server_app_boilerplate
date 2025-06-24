import { ResultSetHeader, RowDataPacket } from "mysql2";
import { DB } from "./db";
import { Log } from "../lib/log";

export class DBHelper {
    static register = (id: string, token?: string) => new Promise<boolean>((resolve, reject) => {
        let sql = `SELECT * FROM user WHERE device_id = ?;`;
        DB.con().query<RowDataPacket[]>(sql, [id], (err, result) => {
            if (err) {
                Log.dev(err);
                resolve(false);
            }
            else {
                const exists = result.length > 0;
                if (exists) {
                    // User alredy exists
                    const row = result[0];
                    if ((!!token) && (token != row.push_token)) {
                        // a new push token has been supplied
                        let sql = `UPDATE user SET last_updated = ?, push_token = ? WHERE device_id = ?;`;
                        let ins = [Date.now(), token, id];
                        DB.con().query<ResultSetHeader>(sql, ins, (err, result) => {
                            if (err) {
                                Log.dev(err);
                                resolve(false);
                            }
                            else {
                                resolve(true);
                            }
                        });
                    }
                    else {
                        resolve(true);
                    }
                }
                else {
                    // fresh Registration
                    let sql = `INSERT INTO user (device_id, last_updated, reg_timestamp${token ? ', push_token' : ''}) VALUES(?, ?, ?${token ? ', ?' : ''});`;
                    let ins = [id, Date.now(), Date.now()];
                    if (token) {
                        ins.push(token);
                    }
                    DB.con().query<ResultSetHeader>(sql, ins, (err, result) => {
                        if (err) {
                            Log.dev(err);
                            resolve(false);
                        }
                        else {
                            resolve(true);
                        }
                    });
                }
            }
        });
    });
}