
import { injectable, inject } from 'inversify';
import { TYPES } from '../../core/types';
import { ApiClient } from '../api/ApiClient';
import { ApiEndpointProvider } from '../api/ApiEndpointProvider';
import { IConfigRepository } from '../../domain/interfaces/repositories/IConfigRepository';
import { CountriesResult } from '../../domain/interfaces/repositories/CountriesResult';
import { HealthStatus } from '../../domain/interfaces/repositories/HealthStatus';

interface ApiCountriesResponse {
  total_countries: number;
  countries: {
    name: string;
    event_count: number;
  }[];
}

interface ApiHealthResponse {
  status: string;
  version: string;
  database: string;
  ai_configured: boolean;
  environment: string;
}

@injectable()
export class ConfigRepositoryImpl implements IConfigRepository {
  constructor(
    @inject(TYPES.ApiClient)
    private apiClient: ApiClient,
    @inject(TYPES.ApiEndpointProvider)
    private endpoints: ApiEndpointProvider
  ) {}

  async getCountries(): Promise<CountriesResult> {
    const response = await this.apiClient.get<ApiCountriesResponse>(this.endpoints.countries);
    return {
      totalCountries: response.total_countries,
      countries: response.countries.map(c => ({
        name: c.name,
        eventCount: c.event_count,
      })),
    };
  }

  async getHealth(): Promise<HealthStatus> {
    const response = await this.apiClient.get<ApiHealthResponse>(this.endpoints.health);
    return {
      status: response.status,
      version: response.version,
      database: response.database,
      aiConfigured: response.ai_configured,
      environment: response.environment,
    };
  }
}
