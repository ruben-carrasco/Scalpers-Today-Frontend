
export const API_CONFIG = {
  HOST: 'scalpertoday-ruben.azurewebsites.net',
  PROTOCOL: 'https',
  VERSION: 'v1',
  TIMEOUT: 30000,
  RETRIES: 3,
};

export function buildApiUrl(): string {
  if (process.env.EXPO_PUBLIC_API_URL) {
    return process.env.EXPO_PUBLIC_API_URL;
  }
  return `${API_CONFIG.PROTOCOL}://${API_CONFIG.HOST}/api/${API_CONFIG.VERSION}`;
}

export function logApiConfig(): void {
  console.log('API Configuration:');
  console.log(`  URL: ${buildApiUrl()}`);
  console.log(`  Host: ${API_CONFIG.HOST}`);
  console.log(`  Timeout: ${API_CONFIG.TIMEOUT}ms`);
}
