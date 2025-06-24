// src/utils/deviceId.ts

import { getAndroidId, getIosIdForVendorAsync } from 'expo-application';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import { v4 as uuidv4 } from 'uuid';
import { Log } from './log';

const DEVICE_ID_KEY = 'device_id';

export async function getDeviceId(): Promise<string> {
    // 1. Check if we already stored a device ID
    const stored = await SecureStore.getItemAsync(DEVICE_ID_KEY);
    if (stored) return stored;

    let deviceId: string | null = null;

    // 2. Try to get native device ID
    try {
        if (Platform.OS == "android" && getAndroidId()) {
            deviceId = getAndroidId();
        } else if (Platform.OS == "ios" && (await getIosIdForVendorAsync())) {
            deviceId = await getIosIdForVendorAsync();
        }
    } catch (err) {
        // fall through
        Log.dev(err);
    }

    // 3. If no native ID, fallback to UUID
    if (!deviceId) {
        deviceId = uuidv4();
    }

    // 4. Store the result securely
    await SecureStore.setItemAsync(DEVICE_ID_KEY, deviceId);

    return deviceId;
}
