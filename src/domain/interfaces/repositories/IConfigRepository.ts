import { CountriesResult } from './CountriesResult';
import { HealthStatus } from './HealthStatus';

export interface IConfigRepository {
  getCountries(): Promise<CountriesResult>;
  getHealth(): Promise<HealthStatus>;
}
