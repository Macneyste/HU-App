import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

function getWebStorage(): Storage | null {
  if (typeof globalThis.localStorage === 'undefined') return null;
  return globalThis.localStorage;
}

export const platformStorage = {
  async setItem(name: string, value: string) {
    if (Platform.OS === 'web') {
      getWebStorage()?.setItem(name, value);
      return;
    }

    await SecureStore.setItemAsync(name, value);
  },

  async getItem(name: string) {
    if (Platform.OS === 'web') {
      return getWebStorage()?.getItem(name) ?? null;
    }

    return SecureStore.getItemAsync(name);
  },

  async removeItem(name: string) {
    if (Platform.OS === 'web') {
      getWebStorage()?.removeItem(name);
      return;
    }

    await SecureStore.deleteItemAsync(name);
  },
};
