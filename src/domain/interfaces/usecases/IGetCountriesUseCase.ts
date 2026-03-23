import { CountriesResult } from '../repositories/CountriesResult';

export interface IGetCountriesUseCase {
  execute(): Promise<CountriesResult>;
}
