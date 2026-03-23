import { injectable, inject } from 'inversify';
import { TYPES } from '../../../core/types';
import { IGetCountriesUseCase } from '../../interfaces/usecases/IGetCountriesUseCase';
import { IConfigRepository } from '../../interfaces/repositories/IConfigRepository';
import { CountriesResult } from '../../interfaces/repositories/CountriesResult';

@injectable()
export class GetCountriesUseCase implements IGetCountriesUseCase {
  constructor(
    @inject(TYPES.ConfigRepository)
    private configRepository: IConfigRepository
  ) {}

  async execute(): Promise<CountriesResult> {
    return this.configRepository.getCountries();
  }
}
