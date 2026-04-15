import { injectable, inject } from 'inversify';
import { makeAutoObservable, runInAction } from 'mobx';
import { TYPES } from '../../core/types';
import { IGetEventsUseCase } from '../../domain/interfaces/usecases/IGetEventsUseCase';
import { IGetUpcomingEventsUseCase } from '../../domain/interfaces/usecases/IGetUpcomingEventsUseCase';
import { EventFilters } from '../../domain/interfaces/repositories/EventFilters';
import { EventModel, createEventModel } from '../models/EventModel';
import { NetworkError, getErrorMessage } from '../../core/errors';
import { CacheService } from '../../services/CacheService';
import { EconomicEvent } from '../../domain/entities/EconomicEvent';

const CACHE_TTL_MS = 2 * 60 * 1000;
const EVENTS_CACHE_KEY = '@cache/events-week';
const MADRID_TIMEZONE = 'Europe/Madrid';
const SPANISH_LOCALE = 'es-ES';

export interface WeekDayOption {
  date: string;
  shortLabel: string;
  fullLabel: string;
  isToday: boolean;
  count: number;
}

function getFormatter(
  options: Intl.DateTimeFormatOptions,
  locale: string = SPANISH_LOCALE
): Intl.DateTimeFormat {
  return new Intl.DateTimeFormat(locale, {
    ...options,
    timeZone: options.timeZone ?? 'UTC',
  });
}

function getMadridTodayIso(): string {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: MADRID_TIMEZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(new Date());

  const values = Object.fromEntries(parts.map(part => [part.type, part.value]));
  return `${values.year}-${values.month}-${values.day}`;
}

function parseIsoDate(date: string): Date {
  return new Date(`${date}T00:00:00Z`);
}

function buildCurrentWeekDates(): string[] {
  const today = parseIsoDate(getMadridTodayIso());
  const mondayOffset = (today.getUTCDay() + 6) % 7;
  const monday = new Date(today);
  monday.setUTCDate(today.getUTCDate() - mondayOffset);

  return Array.from({ length: 7 }, (_, index) => {
    const value = new Date(monday);
    value.setUTCDate(monday.getUTCDate() + index);
    return value.toISOString().slice(0, 10);
  });
}

function buildWeekDayOptions(events: EventModel[]): WeekDayOption[] {
  const todayIso = getMadridTodayIso();
  const eventCountByDate = events.reduce<Record<string, number>>((acc, event) => {
    if (!event.eventDate) {
      return acc;
    }

    acc[event.eventDate] = (acc[event.eventDate] ?? 0) + 1;
    return acc;
  }, {});

  return buildCurrentWeekDates().map(date => {
    const currentDate = parseIsoDate(date);
    return {
      date,
      shortLabel: getFormatter({ weekday: 'short', day: 'numeric' }).format(currentDate),
      fullLabel: getFormatter({ weekday: 'long', day: 'numeric', month: 'long' }).format(currentDate),
      isToday: date === todayIso,
      count: eventCountByDate[date] ?? 0,
    };
  });
}

function normalizeDataValue(value: string | null | undefined): string {
  return value?.trim().toUpperCase() ?? '';
}

@injectable()
export class EventsViewModel {
  allWeekEvents: EventModel[] = [];
  events: EventModel[] = [];
  upcomingEvents: EventModel[] = [];
  availableCountries: string[] = [];
  weekDays: WeekDayOption[] = [];
  selectedDate: string = getMadridTodayIso();
  total: number = 0;
  filters: EventFilters = {};
  isLoading: boolean = false;
  isLoadingUpcoming: boolean = false;
  error: string | null = null;
  private lastFetchTime: number = 0;
  private _loadRequestId: number = 0;
  private _upcomingRequestId: number = 0;
  private _searchDebounceTimer: ReturnType<typeof setTimeout> | null = null;

  constructor(
    @inject(TYPES.GetEventsUseCase)
    private getEventsUseCase: IGetEventsUseCase,
    @inject(TYPES.GetUpcomingEventsUseCase)
    private getUpcomingEventsUseCase: IGetUpcomingEventsUseCase,
    @inject(TYPES.CacheService)
    private cacheService: CacheService
  ) {
    makeAutoObservable(this, {
      lastFetchTime: false,
      _loadRequestId: false,
      _upcomingRequestId: false,
      _searchDebounceTimer: false,
    } as Record<string, boolean>);

    this.weekDays = buildWeekDayOptions([]);
  }

  get selectedDayLabel(): string {
    const selectedDay = this.weekDays.find(day => day.date === this.selectedDate);
    return selectedDay?.fullLabel ?? this.selectedDate;
  }

  private normalizeFilters(filters: EventFilters): EventFilters {
    const normalizedFilters: EventFilters = {};

    if (filters.importance !== undefined) {
      normalizedFilters.importance = filters.importance;
    }

    if (filters.country) {
      normalizedFilters.country = filters.country;
    }

    if (filters.hasData !== undefined) {
      normalizedFilters.hasData = filters.hasData;
    }

    const normalizedSearch = filters.search?.trim();
    if (normalizedSearch) {
      normalizedFilters.search = normalizedSearch;
    }

    return normalizedFilters;
  }

  private applyVisibleState(): void {
    const normalizedFilters = this.normalizeFilters(this.filters);
    const selectedDayEvents = this.allWeekEvents.filter(event => event.eventDate === this.selectedDate);
    const filteredEvents = selectedDayEvents.filter(event => {
      if (
        normalizedFilters.importance !== undefined &&
        event.importance !== normalizedFilters.importance
      ) {
        return false;
      }

      if (normalizedFilters.country && event.country !== normalizedFilters.country) {
        return false;
      }

      if (normalizedFilters.hasData !== undefined) {
        const hasData = normalizeDataValue(event.actual) !== '' && normalizeDataValue(event.actual) !== 'N/A';
        if (hasData !== normalizedFilters.hasData) {
          return false;
        }
      }

      if (normalizedFilters.search) {
        const term = normalizedFilters.search.toLowerCase();
        const haystack = `${event.title} ${event.country} ${event.currency}`.toLowerCase();
        if (!haystack.includes(term)) {
          return false;
        }
      }

      return true;
    });

    const countries = [...new Set(selectedDayEvents.map(event => event.country).filter(Boolean))];
    this.availableCountries = countries.sort((left, right) => left.localeCompare(right));
    this.weekDays = buildWeekDayOptions(this.allWeekEvents);
    this.events = filteredEvents;
    this.total = filteredEvents.length;
  }

  private hydrateWeekEvents(events: EconomicEvent[] | EventModel[]): void {
    this.allWeekEvents = events.map(event => createEventModel(event));

    if (!this.weekDays.some(day => day.date === this.selectedDate)) {
      this.selectedDate = getMadridTodayIso();
    }

    this.applyVisibleState();
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
        runInAction(() => {
          this.applyVisibleState();
        });
      }, 300);
      return;
    }

    this.applyVisibleState();
  }

  async loadEvents(force: boolean = false): Promise<void> {
    const now = Date.now();
    if (!force && this.allWeekEvents.length > 0 && now - this.lastFetchTime < CACHE_TTL_MS) {
      return;
    }

    const requestId = ++this._loadRequestId;
    this.isLoading = true;
    this.error = null;

    if (this.allWeekEvents.length === 0) {
      const cached = await this.cacheService.get<{ events: EventModel[] }>(EVENTS_CACHE_KEY, CACHE_TTL_MS);
      if (cached && requestId === this._loadRequestId) {
        runInAction(() => {
          this.hydrateWeekEvents(cached.events);
        });
      }
    }

    try {
      const events = await this.getEventsUseCase.execute();
      if (requestId !== this._loadRequestId) {
        return;
      }

      runInAction(() => {
        this.hydrateWeekEvents(events);
        this.lastFetchTime = Date.now();
      });

      if (requestId === this._loadRequestId) {
        await this.cacheService.set(EVENTS_CACHE_KEY, { events });
      }
    } catch (err) {
      runInAction(() => {
        if (requestId !== this._loadRequestId) {
          return;
        }
        if (err instanceof NetworkError) {
          this.error = this.allWeekEvents.length > 0
            ? 'Modo sin conexión. Mostrando datos guardados.'
            : 'Sin conexión a internet.';
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
    const requestId = ++this._upcomingRequestId;
    this.isLoadingUpcoming = true;

    try {
      const result = await this.getUpcomingEventsUseCase.execute(limit);
      runInAction(() => {
        if (requestId !== this._upcomingRequestId) {
          return;
        }
        this.upcomingEvents = result.events.map(e => createEventModel(e));
      });
    } catch (err) {
      runInAction(() => {
        if (requestId !== this._upcomingRequestId) {
          return;
        }
        if (err instanceof NetworkError) {
          this.error = 'Sin conexión a internet.';
        } else {
          this.error = getErrorMessage(err);
        }
      });
    } finally {
      runInAction(() => {
        if (requestId === this._upcomingRequestId) {
          this.isLoadingUpcoming = false;
        }
      });
    }
  }

  setSelectedDate(date: string): void {
    if (this.selectedDate === date) {
      return;
    }

    this.selectedDate = date;
    this.applyVisibleState();
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

  findEventById(eventId: string): EventModel | undefined {
    return this.allWeekEvents.find(event => event.id === eventId);
  }

  private patchEventState(eventId: string, updater: (event: EventModel) => EventModel): void {
    this.allWeekEvents = this.allWeekEvents.map(event => (
      event.id === eventId ? updater(event) : event
    ));
    this.applyVisibleState();
  }

  toggleEventExpanded(eventId: string): void {
    this.patchEventState(eventId, event => ({ ...event, isExpanded: !event.isExpanded }));
  }

  toggleShowAnalysis(eventId: string): void {
    this.patchEventState(eventId, event => ({ ...event, showAnalysis: !event.showAnalysis }));
  }

  reset(): void {
    if (this._searchDebounceTimer) {
      clearTimeout(this._searchDebounceTimer);
      this._searchDebounceTimer = null;
    }

    this.allWeekEvents = [];
    this.events = [];
    this.upcomingEvents = [];
    this.availableCountries = [];
    this.weekDays = buildWeekDayOptions([]);
    this.selectedDate = getMadridTodayIso();
    this.total = 0;
    this.filters = {};
    this.error = null;
    this.lastFetchTime = 0;
    this._loadRequestId += 1;
    this._upcomingRequestId += 1;
  }
}
