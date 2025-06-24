// src/api/token.ts
import * as SecureStore from 'expo-secure-store';

const TOKEN_KEY = 'access_token';

export async function getToken(): Promise<string | null> {
    return SecureStore.getItemAsync(TOKEN_KEY);
}

export async function storeToken(token: string) {
    await SecureStore.setItemAsync(TOKEN_KEY, token);
}

export async function clearToken() {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
}
