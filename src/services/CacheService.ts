import AsyncStorage from '@react-native-async-storage/async-storage';
import { injectable } from 'inversify';

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

@injectable()
export class CacheService {
  async set<T>(key: string, value: T): Promise<void> {
    try {
      const entry: CacheEntry<T> = {
        data: value,
        timestamp: Date.now(),
      };
      const jsonValue = JSON.stringify(entry);
      await AsyncStorage.setItem(key, jsonValue);
    } catch (e) {
      console.warn(`[CacheService] Failed to save key ${key}`, e);
    }
  }

  async get<T>(key: string, ttlMs?: number): Promise<T | null> {
    try {
      const jsonValue = await AsyncStorage.getItem(key);
      if (jsonValue == null) return null;

      const parsed = JSON.parse(jsonValue);

      // Support legacy entries without timestamp wrapper
      if (parsed && typeof parsed === 'object' && 'data' in parsed && 'timestamp' in parsed) {
        const entry = parsed as CacheEntry<T>;
        if (ttlMs && Date.now() - entry.timestamp > ttlMs) {
          await this.remove(key);
          return null;
        }
        return entry.data;
      }

      // Legacy fallback: raw data without wrapper
      return parsed as T;
    } catch (e) {
      console.warn(`[CacheService] Failed to get key ${key}`, e);
      return null;
    }
  }

  async remove(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(key);
    } catch (e) {
      console.warn(`[CacheService] Failed to remove key ${key}`, e);
    }
  }
}
