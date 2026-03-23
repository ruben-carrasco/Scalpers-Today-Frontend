import { ApiClient } from '../../data/api/ApiClient';
import { API_CONFIG } from '../../config/api.config';

declare const global: { fetch: typeof fetch };

// We need to test the retry logic. ApiClient uses @injectable and @inject decorators,
// so we test the retry method indirectly through public methods.
// Since constructing the class requires inversify, we'll test the logic by
// creating a minimal subclass that exposes the private methods.

// Mock the token manager
const mockTokenManager = {
  loadToken: jest.fn().mockResolvedValue(null),
  saveToken: jest.fn().mockResolvedValue(undefined),
  clearToken: jest.fn().mockResolvedValue(undefined),
  getToken: jest.fn().mockReturnValue(null),
};

// Mock the endpoint provider
const mockEndpointProvider = {
  getBaseUrl: jest.fn().mockReturnValue('https://test.api.com/api/v1'),
};

// We need to access the ApiClient without inversify decorators.
// The simplest approach is to mock fetch and test through the public interface.

// Store original fetch
const originalFetch = global.fetch;

beforeEach(() => {
  jest.clearAllMocks();
  mockTokenManager.getToken.mockReturnValue(null);
});

afterAll(() => {
  global.fetch = originalFetch;
});

// Create ApiClient bypassing inversify by directly assigning dependencies
function createClient(): ApiClient {
  const client = Object.create(ApiClient.prototype);
  client.endpointProvider = mockEndpointProvider;
  client.tokenManager = mockTokenManager;
  client._onUnauthorized = null;
  return client;
}

describe('ApiClient retry logic', () => {
  it('retries on network error and succeeds on second attempt', async () => {
    const client = createClient();

    let callCount = 0;
    global.fetch = jest.fn().mockImplementation(() => {
      callCount++;
      if (callCount === 1) {
        throw new TypeError('Failed to fetch');
      }
      return Promise.resolve({
        ok: true,
        status: 200,
        json: () => Promise.resolve({ data: 'success' }),
      });
    });

    const result = await client.get<{ data: string }>('https://test.api.com/test');
    expect(result).toEqual({ data: 'success' });
    expect(callCount).toBe(2);
  });

  it('retries on 500 server error', async () => {
    const client = createClient();

    let callCount = 0;
    global.fetch = jest.fn().mockImplementation(() => {
      callCount++;
      if (callCount === 1) {
        return Promise.resolve({
          ok: false,
          status: 500,
          json: () => Promise.resolve({ message: 'Server error' }),
        });
      }
      return Promise.resolve({
        ok: true,
        status: 200,
        json: () => Promise.resolve({ data: 'recovered' }),
      });
    });

    const result = await client.get<{ data: string }>('https://test.api.com/test');
    expect(result).toEqual({ data: 'recovered' });
    expect(callCount).toBe(2);
  });

  it('does NOT retry on 400 client error', async () => {
    const client = createClient();

    let callCount = 0;
    global.fetch = jest.fn().mockImplementation(() => {
      callCount++;
      return Promise.resolve({
        ok: false,
        status: 400,
        json: () => Promise.resolve({ message: 'Bad request' }),
      });
    });

    await expect(client.get('https://test.api.com/test')).rejects.toThrow();
    expect(callCount).toBe(1);
  });

  it('throws after exhausting retries', async () => {
    const client = createClient();

    global.fetch = jest.fn().mockImplementation(() => {
      throw new TypeError('Failed to fetch');
    });

    await expect(client.get('https://test.api.com/test')).rejects.toThrow();
    expect(global.fetch).toHaveBeenCalledTimes(API_CONFIG.RETRIES);
  });

  it('handles 401 without retry', async () => {
    const client = createClient();
    const onUnauth = jest.fn();
    client.setOnUnauthorized(onUnauth);

    let callCount = 0;
    global.fetch = jest.fn().mockImplementation(() => {
      callCount++;
      return Promise.resolve({
        ok: false,
        status: 401,
        json: () => Promise.resolve({ detail: 'Token expired' }),
      });
    });

    await expect(client.get('https://test.api.com/test')).rejects.toThrow();
    expect(onUnauth).toHaveBeenCalled();
    expect(callCount).toBe(1);
  });
});
