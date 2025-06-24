import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Log } from './log';

export async function registerForPushTokenAsync(): Promise<string | null> {
    if (!Device.isDevice) {
        Log.dev('Must use physical device for push notifications');
        return null;
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
    }

    if (finalStatus !== 'granted') {
        Log.dev('Push notification permission denied');
        return null;
    }

    const tokenData = await Notifications.getExpoPushTokenAsync();
    const pushToken = tokenData.data;

    return pushToken;
}
