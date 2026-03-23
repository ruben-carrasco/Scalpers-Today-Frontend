
export interface ITokenManager {
  loadToken(): Promise<string | null>;

  saveToken(token: string): Promise<void>;

  clearToken(): Promise<void>;

  getToken(): string | null;

  hasToken(): boolean;
}
