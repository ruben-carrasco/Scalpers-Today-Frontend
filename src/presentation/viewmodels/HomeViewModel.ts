import { injectable, inject } from 'inversify';
import { makeAutoObservable, runInAction } from 'mobx';
import { TYPES } from '../../core/types';
import { IGetHomeSummaryUseCase } from '../../domain/interfaces/usecases/IGetHomeSummaryUseCase';
import { IGetDailyBriefingUseCase } from '../../domain/interfaces/usecases/IGetDailyBriefingUseCase';
import { HomeSummary } from '../../domain/entities/HomeSummary';
import { DailyBriefing } from '../../domain/entities/DailyBriefing';
import { NetworkError, getErrorMessage } from '../../core/errors';
import { CacheService } from '../../services/CacheService';

const CACHE_TTL_MS = 2 * 60 * 1000;
const SUMMARY_CACHE_KEY = '@cache/home_summary';
const BRIEFING_CACHE_KEY = '@cache/home_briefing';

@injectable()
export class HomeViewModel {
  summary: HomeSummary | null = null;
  briefing: DailyBriefing | null = null;
  isLoadingSummary: boolean = false;
  isLoadingBriefing: boolean = false;
  summaryError: string | null = null;
  briefingError: string | null = null;
  private lastFetchTime: number = 0;
  private _refreshPromise: Promise<void> | null = null;

  constructor(
    @inject(TYPES.GetHomeSummaryUseCase)
    private getHomeSummaryUseCase: IGetHomeSummaryUseCase,
    @inject(TYPES.GetDailyBriefingUseCase)
    private getDailyBriefingUseCase: IGetDailyBriefingUseCase,
    @inject(TYPES.CacheService)
    private cacheService: CacheService
  ) {
    makeAutoObservable(this, {
      lastFetchTime: false,
      _refreshPromise: false,
    } as Record<string, boolean>);
  }

  get error(): string | null {
    return this.summaryError || this.briefingError;
  }

  async loadSummary(): Promise<void> {
    this.isLoadingSummary = true;
    this.summaryError = null;

    try {
      const summary = await this.getHomeSummaryUseCase.execute();
      runInAction(() => {
        this.summary = summary;
      });
      await this.cacheService.set(SUMMARY_CACHE_KEY, summary);
    } catch (err) {
      if (err instanceof NetworkError) {
        const cachedSummary = await this.cacheService.get<HomeSummary>(SUMMARY_CACHE_KEY);
        runInAction(() => {
          if (cachedSummary) {
            this.summary = cachedSummary;
            this.summaryError = 'Modo sin conexión. Mostrando datos guardados.';
          } else {
            this.summaryError = 'Sin conexión a internet. Verifica tu conexión.';
          }
        });
      } else {
        runInAction(() => {
          this.summaryError = getErrorMessage(err);
        });
      }
    } finally {
      runInAction(() => {
        this.isLoadingSummary = false;
      });
    }
  }

  async loadBriefing(): Promise<void> {
    this.isLoadingBriefing = true;
    this.briefingError = null;

    try {
      const briefing = await this.getDailyBriefingUseCase.execute();
      runInAction(() => {
        this.briefing = briefing;
      });
      await this.cacheService.set(BRIEFING_CACHE_KEY, briefing);
    } catch (err) {
      if (err instanceof NetworkError) {
        const cachedBriefing = await this.cacheService.get<DailyBriefing>(BRIEFING_CACHE_KEY);
        runInAction(() => {
          if (cachedBriefing) {
            this.briefing = cachedBriefing;
            this.briefingError = 'Modo sin conexión. Mostrando datos guardados.';
          } else {
            this.briefingError = 'Sin conexión a internet. Verifica tu conexión.';
          }
        });
      } else {
        runInAction(() => {
          this.briefingError = getErrorMessage(err);
        });
      }
    } finally {
      runInAction(() => {
        this.isLoadingBriefing = false;
      });
    }
  }

  async refresh(force: boolean = false): Promise<void> {
    if (this._refreshPromise) {
      return this._refreshPromise;
    }

    const now = Date.now();
    const hasFreshSummary = this.summary && now - this.lastFetchTime < CACHE_TTL_MS;
    const hasFreshBriefing = this.briefing && now - this.lastFetchTime < CACHE_TTL_MS;

    if (!force && hasFreshSummary && hasFreshBriefing) {
      return;
    }

    this._refreshPromise = (async () => {
      // Quick load from cache first for instant UI response if we have it
      if (!this.summary || !this.briefing) {
        const [cachedSummary, cachedBriefing] = await Promise.all([
          this.cacheService.get<HomeSummary>(SUMMARY_CACHE_KEY),
          this.cacheService.get<DailyBriefing>(BRIEFING_CACHE_KEY),
        ]);
        runInAction(() => {
          if (!this.summary && cachedSummary) this.summary = cachedSummary;
          if (!this.briefing && cachedBriefing) this.briefing = cachedBriefing;
        });
      }

      await Promise.all([this.loadSummary(), this.loadBriefing()]);

      runInAction(() => {
        this.lastFetchTime = Date.now();
      });
    })();

    try {
      await this._refreshPromise;
    } finally {
      runInAction(() => {
        this._refreshPromise = null;
      });
    }
  }

  reset(): void {
    this.summary = null;
    this.briefing = null;
    this.summaryError = null;
    this.briefingError = null;
    this.lastFetchTime = 0;
    this._refreshPromise = null;
  }
}
