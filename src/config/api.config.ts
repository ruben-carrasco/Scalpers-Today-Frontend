export const API_CONFIG = {
  HOST: 'scalpertoday-ruben.azurewebsites.net',
  PROTOCOL: 'https',
  VERSION: 'v1',
  TIMEOUT: 30000,
  RETRIES: 3,
};

function normalizeBaseUrl(url: string): string {
  return url.replace(/\/+$/, '');
}

export function buildApiUrl(): string {
  if (process.env.EXPO_PUBLIC_API_URL) {
    return normalizeBaseUrl(process.env.EXPO_PUBLIC_API_URL);
  }
  return normalizeBaseUrl(
    `${API_CONFIG.PROTOCOL}://${API_CONFIG.HOST}/api/${API_CONFIG.VERSION}`
  );
}
