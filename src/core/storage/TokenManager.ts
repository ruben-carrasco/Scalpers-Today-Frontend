
import { injectable } from 'inversify';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StorageKeys } from './StorageKeys';
import { ITokenManager } from './ITokenManager';

export type { ITokenManager } from './ITokenManager';

const isSecureStoreAvailable = Platform.OS !== 'web';

@injectable()
export class TokenManager implements ITokenManager {
  private token: string | null = null;
  private isLoaded: boolean = false;

  async loadToken(): Promise<string | null> {
    if (this.isLoaded) {
      return this.token;
    }

    try {
      if (isSecureStoreAvailable) {
        this.token = await SecureStore.getItemAsync(StorageKeys.AUTH_TOKEN);
      } else {
        this.token = await AsyncStorage.getItem(StorageKeys.AUTH_TOKEN);
      }
      this.isLoaded = true;
      return this.token;
    } catch (error) {
      if (__DEV__) console.warn('[TokenManager] Error loading token:', error);
      this.isLoaded = true;
      return null;
    }
  }

  async saveToken(token: string): Promise<void> {
    this.token = token;
    this.isLoaded = true;

    try {
      if (isSecureStoreAvailable) {
        await SecureStore.setItemAsync(StorageKeys.AUTH_TOKEN, token);
      } else {
        await AsyncStorage.setItem(StorageKeys.AUTH_TOKEN, token);
      }
    } catch (error) {
      if (__DEV__) console.warn('[TokenManager] Error saving token:', error);
    }
  }

  async clearToken(): Promise<void> {
    this.token = null;
    this.isLoaded = true;

    try {
      if (isSecureStoreAvailable) {
        await SecureStore.deleteItemAsync(StorageKeys.AUTH_TOKEN);
      } else {
        await AsyncStorage.removeItem(StorageKeys.AUTH_TOKEN);
      }
    } catch (error) {
      if (__DEV__) console.warn('[TokenManager] Error clearing token:', error);
    }
  }

  getToken(): string | null {
    return this.token;
  }

  hasToken(): boolean {
    return this.token !== null;
  }
}
