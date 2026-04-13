
import { injectable, inject } from 'inversify';
import { TYPES } from '../../core/types';
import { ApiEndpointProvider } from './ApiEndpointProvider';
import { API_CONFIG } from '../../config/api.config';
import { ITokenManager } from '../../core/storage/TokenManager';
import {
  ApiError,
  TimeoutError,
  ConnectionError,
  TokenExpiredError,
} from '../../core/errors';
import { ApiResponse } from './types';

export { ApiResponse };

export type OnUnauthorizedCallback = () => void;

@injectable()
export class ApiClient {
  private _onUnauthorized: OnUnauthorizedCallback | null = null;

  constructor(
    @inject(TYPES.ApiEndpointProvider)
    private endpointProvider: ApiEndpointProvider,
    @inject(TYPES.TokenManager)
    private tokenManager: ITokenManager
  ) {}

  setOnUnauthorized(callback: OnUnauthorizedCallback): void {
    this._onUnauthorized = callback;
  }

  private debugLog(message: string): void {
    if (__DEV__) {
      console.log(message);
    }
  }

  private async fetchWithTimeout(url: string, options: RequestInit, timeout: number = API_CONFIG.TIMEOUT): Promise<Response> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      return response;
    } catch (error: unknown) {
      clearTimeout(timeoutId);

      if (error instanceof ApiError) {
        throw error;
      }

      const err = error as Error & { name?: string };

      if (err?.name === 'AbortError') {
        throw new TimeoutError();
      }

      if (error instanceof TypeError || err?.message?.includes('fetch')) {
        throw new ConnectionError();
      }

      throw new ConnectionError(err?.message || 'Error de red desconocido');
    }
  }

  private async fetchWithRetry(url: string, options: RequestInit): Promise<Response> {
    const maxRetries = API_CONFIG.RETRIES;
    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const response = await this.fetchWithTimeout(url, options);

        // Retry on 5xx server errors
        if (response.status >= 500 && attempt < maxRetries) {
          this.debugLog(`[API] Server error ${response.status}, retry ${attempt}/${maxRetries}`);
          await this.delay(1000 * Math.pow(2, attempt - 1));
          continue;
        }

        return response;
      } catch (error) {
        lastError = error as Error;

        // Retry on connection errors and timeouts
        if ((error instanceof ConnectionError || error instanceof TimeoutError) && attempt < maxRetries) {
          this.debugLog(`[API] ${error.constructor.name}, retry ${attempt}/${maxRetries}`);
          await this.delay(1000 * Math.pow(2, attempt - 1));
          continue;
        }

        throw error;
      }
    }

    throw lastError!;
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async loadToken(): Promise<string | null> {
    return this.tokenManager.loadToken();
  }

  async setToken(token: string | null): Promise<void> {
    if (token) {
      await this.tokenManager.saveToken(token);
    } else {
      await this.tokenManager.clearToken();
    }
  }

  getToken(): string | null {
    return this.tokenManager.getToken();
  }

  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    const token = this.tokenManager.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  }

  private buildUrl(url: string, params?: Record<string, any>): string {
    if (!params) return url;

    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, String(value));
      }
    });

    const queryString = searchParams.toString();
    return queryString ? `${url}?${queryString}` : url;
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      let message = `HTTP Error: ${response.status}`;
      let responseBody: unknown;

      try {
        responseBody = await response.json();
        const error = responseBody as Record<string, unknown>;
        const detail = error.detail;
        if (typeof detail === 'string') {
          message = detail;
        } else if (typeof detail === 'object' && detail !== null && 'message' in detail) {
          message = (detail as { message: string }).message;
        } else if (typeof error.message === 'string') {
          message = error.message;
        }
      } catch {
      }

      if (__DEV__) console.error(`API Error [${response.status}]:`, message);

      if (response.status === 401) {
        this._onUnauthorized?.();
        throw new TokenExpiredError(message);
      }

      throw new ApiError(message, response.status, undefined, responseBody);
    }

    if (response.status === 204) {
      return undefined as T;
    }

    return response.json();
  }

  async get<T>(url: string, params?: Record<string, any>): Promise<T> {
    const fullUrl = this.buildUrl(url, params);
    this.debugLog(`[API GET] ${fullUrl}`);
    const response = await this.fetchWithRetry(fullUrl, {
      method: 'GET',
      headers: this.getHeaders(),
    });
    return this.handleResponse<T>(response);
  }

  async post<T>(url: string, body?: any): Promise<T> {
    this.debugLog(`[API POST] ${url}`);
    const response = await this.fetchWithRetry(url, {
      method: 'POST',
      headers: this.getHeaders(),
      body: body ? JSON.stringify(body) : undefined,
    });
    return this.handleResponse<T>(response);
  }

  async put<T>(url: string, body?: any): Promise<T> {
    this.debugLog(`[API PUT] ${url}`);
    const response = await this.fetchWithRetry(url, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: body ? JSON.stringify(body) : undefined,
    });
    return this.handleResponse<T>(response);
  }

  async delete(url: string, params?: Record<string, any>): Promise<void> {
    const fullUrl = this.buildUrl(url, params);
    this.debugLog(`[API DELETE] ${fullUrl}`);
    const response = await this.fetchWithRetry(fullUrl, {
      method: 'DELETE',
      headers: this.getHeaders(),
    });
    await this.handleResponse<void>(response);
  }
}
