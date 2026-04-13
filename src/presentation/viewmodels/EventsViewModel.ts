import { injectable, inject } from 'inversify';
import { makeAutoObservable, runInAction } from 'mobx';
import { TYPES } from '../../core/types';
import { IGetFilteredEventsUseCase } from '../../domain/interfaces/usecases/IGetFilteredEventsUseCase';
import { IGetUpcomingEventsUseCase } from '../../domain/interfaces/usecases/IGetUpcomingEventsUseCase';
import { EventFilters } from '../../domain/interfaces/repositories/EventFilters';
import { EventModel, createEventModel } from '../models/EventModel';
import { NetworkError, getErrorMessage } from '../../core/errors';
import { CacheService } from '../../services/CacheService';

const CACHE_TTL_MS = 2 * 60 * 1000;
const EVENTS_CACHE_KEY = '@cache/events';

@injectable()
export class EventsViewModel {
  events: EventModel[] = [];
  upcomingEvents: EventModel[] = [];
  availableCountries: string[] = [];
  total: number = 0;
  filters: EventFilters = {};
  isLoading: boolean = false;
  isLoadingUpcoming: boolean = false;
  error: string | null = null;
  private lastFetchTime: number = 0;
  private lastFiltersKey: string = '';
  private _loadRequestId: number = 0;
  private _searchDebounceTimer: ReturnType<typeof setTimeout> | null = null;

  constructor(
    @inject(TYPES.GetFilteredEventsUseCase)
    private getFilteredEventsUseCase: IGetFilteredEventsUseCase,
    @inject(TYPES.GetUpcomingEventsUseCase)
    private getUpcomingEventsUseCase: IGetUpcomingEventsUseCase,
    @inject(TYPES.CacheService)
    private cacheService: CacheService
  ) {
    makeAutoObservable(this, {
      lastFetchTime: false,
      lastFiltersKey: false,
      _loadRequestId: false,
      _searchDebounceTimer: false,
    } as Record<string, boolean>);
  }

  private normalizeFilters(filters: EventFilters): EventFilters {
    const normalizedFilters: EventFilters = {};

    if (filters.importance !== undefined) {
      normalizedFilters.importance = filters.importance;
    }

    if (filters.country) {
      normalizedFilters.country = filters.country;
    }

    const normalizedSearch = filters.search?.trim();
    if (normalizedSearch) {
      normalizedFilters.search = normalizedSearch;
    }

    return normalizedFilters;
  }

  private updateFilters(nextFilters: EventFilters, options?: { debounce?: boolean }): void {
    const normalizedFilters = this.normalizeFilters(nextFilters);
    const currentFiltersKey = JSON.stringify(this.normalizeFilters(this.filters));
    const nextFiltersKey = JSON.stringify(normalizedFilters);

    if (currentFiltersKey === nextFiltersKey) {
      return;
    }

    this.filters = normalizedFilters;

    if (this._searchDebounceTimer) {
      clearTimeout(this._searchDebounceTimer);
      this._searchDebounceTimer = null;
    }

    if (options?.debounce) {
      this._searchDebounceTimer = setTimeout(() => {
        this._searchDebounceTimer = null;
        void this.loadEvents();
      }, 300);
      return;
    }

    void this.loadEvents();
  }

  async loadEvents(force: boolean = false): Promise<void> {
    const normalizedFilters = this.normalizeFilters(this.filters);
    const filtersKey = JSON.stringify(normalizedFilters);
    const now = Date.now();
    const filtersChanged = filtersKey !== this.lastFiltersKey;

    if (!force && !filtersChanged && this.events.length > 0 && now - this.lastFetchTime < CACHE_TTL_MS) {
      return;
    }

    const requestId = ++this._loadRequestId;
    this.isLoading = true;
    this.error = null;

    // Quick load from cache if no filters and we don't have events
    if (Object.keys(normalizedFilters).length === 0 && this.events.length === 0) {
      const cached = await this.cacheService.get<any>(EVENTS_CACHE_KEY, CACHE_TTL_MS);
      if (cached && requestId === this._loadRequestId) {
        runInAction(() => {
          this.events = cached.events;
          this.total = cached.total;
          this.availableCountries = cached.countries || [];
        });
      }
    }

    try {
      const result = await this.getFilteredEventsUseCase.execute(normalizedFilters);
      runInAction(() => {
        if (requestId !== this._loadRequestId) return;
        this.events = result.events.map(e => createEventModel(e));
        this.total = result.total;
        this.lastFetchTime = Date.now();
        this.lastFiltersKey = filtersKey;
        if (!normalizedFilters.country) {
          const countries = [...new Set(result.events.map(e => e.country).filter(Boolean))];
          this.availableCountries = countries.sort();
        }
      });

      // Save to cache only if no filters are applied to act as a base offline dataset
      if (Object.keys(normalizedFilters).length === 0 && requestId === this._loadRequestId) {
        await this.cacheService.set(EVENTS_CACHE_KEY, {
          events: this.events,
          total: this.total,
          countries: this.availableCountries
        });
      }
    } catch (err) {
      runInAction(() => {
        if (requestId !== this._loadRequestId) return;
        if (err instanceof NetworkError) {
          this.error = 'Modo sin conexión. Mostrando datos guardados.';
        } else {
          this.error = getErrorMessage(err);
        }
      });
    } finally {
      runInAction(() => {
        if (requestId === this._loadRequestId) {
          this.isLoading = false;
        }
      });
    }
  }

  async loadUpcoming(limit: number = 5): Promise<void> {
    this.isLoadingUpcoming = true;

    try {
      const result = await this.getUpcomingEventsUseCase.execute(limit);
      runInAction(() => {
        this.upcomingEvents = result.events.map(e => createEventModel(e));
      });
    } catch (err) {
      runInAction(() => {
        if (err instanceof NetworkError) {
          this.error = 'Sin conexión a internet.';
        } else {
          this.error = getErrorMessage(err);
        }
      });
    } finally {
      runInAction(() => {
        this.isLoadingUpcoming = false;
      });
    }
  }

  setFilters(filters: EventFilters): void {
    this.updateFilters(filters);
  }

  setImportanceFilter(importance: number | undefined): void {
    this.updateFilters({ ...this.filters, importance });
  }

  setCountryFilter(country: string | undefined): void {
    this.updateFilters({ ...this.filters, country });
  }

  setSearchFilter(search: string | undefined): void {
    this.updateFilters({ ...this.filters, search }, { debounce: true });
  }

  clearFilters(): void {
    this.updateFilters({}, { debounce: false });
  }

  toggleEventExpanded(eventId: string): void {
    this.events = this.events.map(e =>
      e.id === eventId ? { ...e, isExpanded: !e.isExpanded } : e
    );
  }

  toggleShowAnalysis(eventId: string): void {
    this.events = this.events.map(e =>
      e.id === eventId ? { ...e, showAnalysis: !e.showAnalysis } : e
    );
  }

  reset(): void {
    if (this._searchDebounceTimer) {
      clearTimeout(this._searchDebounceTimer);
      this._searchDebounceTimer = null;
    }

    this.events = [];
    this.upcomingEvents = [];
    this.availableCountries = [];
    this.total = 0;
    this.filters = {};
    this.error = null;
    this.lastFetchTime = 0;
    this.lastFiltersKey = '';
  }
}
