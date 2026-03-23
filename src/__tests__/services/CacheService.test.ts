import AsyncStorage from '@react-native-async-storage/async-storage';
import { CacheService } from '../../services/CacheService';

// Reset the mock store before each test
beforeEach(() => {
  (AsyncStorage as any)._store.clear();
  jest.clearAllMocks();
});

function createService(): CacheService {
  // Bypass inversify by creating instance directly
  return new CacheService();
}

describe('CacheService', () => {
  describe('set and get', () => {
    it('stores and retrieves data correctly', async () => {
      const service = createService();
      await service.set('key1', { foo: 'bar' });
      const result = await service.get<{ foo: string }>('key1');
      expect(result).toEqual({ foo: 'bar' });
    });

    it('stores data with timestamp wrapper', async () => {
      const service = createService();
      await service.set('key1', 'hello');

      const raw = await AsyncStorage.getItem('key1');
      const parsed = JSON.parse(raw!);
      expect(parsed).toHaveProperty('data', 'hello');
      expect(parsed).toHaveProperty('timestamp');
      expect(typeof parsed.timestamp).toBe('number');
    });
  });

  describe('TTL', () => {
    it('returns data within TTL', async () => {
      const service = createService();
      await service.set('key1', 'fresh');
      const result = await service.get<string>('key1', 60000); // 60s TTL
      expect(result).toBe('fresh');
    });

    it('returns null for expired data', async () => {
      const service = createService();

      // Manually insert old data
      const oldEntry = JSON.stringify({
        data: 'stale',
        timestamp: Date.now() - 120000, // 2 minutes ago
      });
      await AsyncStorage.setItem('key1', oldEntry);

      const result = await service.get<string>('key1', 60000); // 60s TTL
      expect(result).toBeNull();
    });

    it('returns data when no TTL specified (ignores age)', async () => {
      const service = createService();

      const oldEntry = JSON.stringify({
        data: 'old',
        timestamp: Date.now() - 999999999,
      });
      await AsyncStorage.setItem('key1', oldEntry);

      const result = await service.get<string>('key1');
      expect(result).toBe('old');
    });
  });

  describe('legacy data support', () => {
    it('handles data stored without timestamp wrapper', async () => {
      const service = createService();

      // Simulate legacy format (raw JSON without wrapper)
      await AsyncStorage.setItem('legacy', JSON.stringify({ name: 'test' }));

      const result = await service.get<{ name: string }>('legacy');
      expect(result).toEqual({ name: 'test' });
    });
  });

  describe('remove', () => {
    it('deletes data', async () => {
      const service = createService();
      await service.set('key1', 'value');
      await service.remove('key1');
      const result = await service.get('key1');
      expect(result).toBeNull();
    });
  });

  describe('get non-existent key', () => {
    it('returns null', async () => {
      const service = createService();
      const result = await service.get('nonexistent');
      expect(result).toBeNull();
    });
  });

  describe('complex data types', () => {
    it('handles arrays', async () => {
      const service = createService();
      await service.set('arr', [1, 2, 3]);
      const result = await service.get<number[]>('arr');
      expect(result).toEqual([1, 2, 3]);
    });

    it('handles nested objects', async () => {
      const service = createService();
      const data = { a: { b: { c: 'deep' } } };
      await service.set('nested', data);
      const result = await service.get<typeof data>('nested');
      expect(result).toEqual(data);
    });
  });
});
