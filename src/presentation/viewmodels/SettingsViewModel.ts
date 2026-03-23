
import { injectable, inject } from 'inversify';
import { makeAutoObservable, runInAction } from 'mobx';
import { TYPES } from '../../core/types';
import { IGetCountriesUseCase } from '../../domain/interfaces/usecases/IGetCountriesUseCase';
import { Country } from '../../domain/interfaces/repositories/Country';
import { getErrorMessage } from '../../core/errors';

@injectable()
export class SettingsViewModel {
  countries: Country[] = [];
  favoriteCountries: string[] = [];
  isLoading: boolean = false;
  error: string | null = null;

  constructor(
    @inject(TYPES.GetCountriesUseCase)
    private getCountriesUseCase: IGetCountriesUseCase
  ) {
    makeAutoObservable(this);
  }

  async loadCountries(): Promise<void> {
    this.isLoading = true;
    this.error = null;

    try {
      const result = await this.getCountriesUseCase.execute();
      runInAction(() => {
        this.countries = result.countries;
      });
    } catch (err) {
      runInAction(() => {
        this.error = getErrorMessage(err);
      });
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  }

  toggleFavoriteCountry(country: string): void {
    if (this.favoriteCountries.includes(country)) {
      this.favoriteCountries = this.favoriteCountries.filter(c => c !== country);
    } else {
      this.favoriteCountries = [...this.favoriteCountries, country];
    }
  }

  setFavoriteCountries(countries: string[]): void {
    this.favoriteCountries = countries;
  }

  reset(): void {
    this.countries = [];
    this.favoriteCountries = [];
    this.error = null;
  }
}
