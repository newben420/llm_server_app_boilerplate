// utils/requestWhenOnline.ts
import * as Network from 'expo-network';
import { Log } from './log';

type RequestFn = () => Promise<any>;

let retryQueue: RequestFn[] = [];
let isWatching = false;

export async function requestWhenOnline(fn: RequestFn) {
    const { isInternetReachable } = await Network.getNetworkStateAsync();

    if (isInternetReachable) {
        try {
            fn();
        } catch (error) {
            Log.dev(error);
        }
    }

    retryQueue.push(fn);

    if (!isWatching) {
        isWatching = true;
        Network.addNetworkStateListener(async (state) => {
            if (state.isInternetReachable) {
                const queue = [...retryQueue];
                retryQueue = [];
                for (const req of queue) {
                    try {
                        await req();
                    } catch (err) {
                        Log.dev(err);
                        retryQueue.push(req);
                    }
                }
            }
        });
    }
}
