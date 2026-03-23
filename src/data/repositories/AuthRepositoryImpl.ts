
import { injectable, inject } from 'inversify';
import { TYPES } from '../../core/types';
import { ApiClient } from '../api/ApiClient';
import { ApiEndpointProvider } from '../api/ApiEndpointProvider';
import { ITokenManager } from '../../core/storage/TokenManager';
import { IAuthRepository } from '../../domain/interfaces/repositories/IAuthRepository';
import { LoginParams } from '../../domain/interfaces/repositories/LoginParams';
import { RegisterParams } from '../../domain/interfaces/repositories/RegisterParams';
import { User } from '../../domain/entities/User';
import { AuthResult } from '../../domain/entities/AuthResult';
import { AuthToken } from '../../domain/entities/AuthToken';

interface ApiUserResponse {
  id: string;
  email: string;
  name: string;
  avatar_url: string | null;
  preferences: {
    language: string;
    currency: string;
    timezone: string;
  };
  is_verified: boolean;
}

interface ApiTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

interface ApiAuthResponse {
  user: ApiUserResponse;
  token: ApiTokenResponse;
}

@injectable()
export class AuthRepositoryImpl implements IAuthRepository {
  constructor(
    @inject(TYPES.ApiClient)
    private apiClient: ApiClient,
    @inject(TYPES.ApiEndpointProvider)
    private endpoints: ApiEndpointProvider,
    @inject(TYPES.TokenManager)
    private tokenManager: ITokenManager
  ) {}

  private mapUser(apiUser: ApiUserResponse): User {
    return {
      id: apiUser.id,
      email: apiUser.email,
      name: apiUser.name,
      avatarUrl: apiUser.avatar_url,
      preferences: {
        language: apiUser.preferences.language as 'es' | 'en',
        currency: apiUser.preferences.currency as 'usd' | 'eur' | 'gbp',
        timezone: apiUser.preferences.timezone,
      },
      isVerified: apiUser.is_verified,
    };
  }

  private mapToken(apiToken: ApiTokenResponse): AuthToken {
    return {
      accessToken: apiToken.access_token,
      tokenType: apiToken.token_type,
      expiresIn: apiToken.expires_in,
    };
  }

  private mapAuthResult(response: ApiAuthResponse): AuthResult {
    return {
      user: this.mapUser(response.user),
      token: this.mapToken(response.token),
    };
  }

  async login(params: LoginParams): Promise<AuthResult> {
    const response = await this.apiClient.post<ApiAuthResponse>(
      this.endpoints.login,
      params
    );
    return this.mapAuthResult(response);
  }

  async register(params: RegisterParams): Promise<AuthResult> {
    const response = await this.apiClient.post<ApiAuthResponse>(
      this.endpoints.register,
      params
    );
    return this.mapAuthResult(response);
  }

  async getCurrentUser(): Promise<User> {
    const response = await this.apiClient.get<ApiUserResponse>(this.endpoints.me);
    return this.mapUser(response);
  }

  async logout(): Promise<void> {
  }

  async getStoredToken(): Promise<string | null> {
    return this.tokenManager.loadToken();
  }

  async setStoredToken(token: string | null): Promise<void> {
    if (token) {
      await this.tokenManager.saveToken(token);
    } else {
      await this.tokenManager.clearToken();
    }
  }
}
