// src/api/auth.ts
import axios from 'axios';
import { storeToken } from './token';
import { Site } from '../site';
import { getDeviceId } from './deviceId';
import { registerForPushTokenAsync } from './registerForPushTokenAsync';
import { Log } from './log';

const API_BASE = Site.API_BASE;

export function refreshTokenWithExpoId(): Promise<string> {
    return new Promise<string>(async (resolve, reject) => {
        const id = await getDeviceId();
        let token = "";
        axios.post(`${API_BASE}/register`, {
            id,
            token: await registerForPushTokenAsync(),
        }).then(async r => {
            if(r.status == 200 && r.data && r.data.message){
                token =  r.data.message;
                console.log(token);
                await storeToken(token);
            }
        }).catch(err => {
            Log.dev(err);
        }).finally(() => {
            resolve(token);
        })
    });
}
