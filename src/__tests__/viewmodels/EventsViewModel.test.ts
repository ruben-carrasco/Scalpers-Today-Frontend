import { EventsViewModel } from '../../presentation/viewmodels/EventsViewModel';
import { EventModel } from '../../presentation/models/EventModel';

// Create mock dependencies
const mockGetFilteredEvents = {
  execute: jest.fn().mockResolvedValue({
    events: [],
    total: 0,
  }),
};

const mockGetUpcomingEvents = {
  execute: jest.fn().mockResolvedValue({
    events: [],
  }),
};

const mockCacheService = {
  get: jest.fn().mockResolvedValue(null),
  set: jest.fn().mockResolvedValue(undefined),
  remove: jest.fn().mockResolvedValue(undefined),
};

const TEST_DATE = '2026-04-26';

function createViewModel(): EventsViewModel {
  const vm = Object.create(EventsViewModel.prototype);
  // Manually set the private dependencies (bypassing inversify)
  vm.getFilteredEventsUseCase = mockGetFilteredEvents;
  vm.getUpcomingEventsUseCase = mockGetUpcomingEvents;
  vm.cacheService = mockCacheService;
  // Initialize observable properties
  vm.allWeekEvents = [];
  vm.events = [];
  vm.upcomingEvents = [];
  vm.availableCountries = [];
  vm.weekDays = [];
  vm.selectedDate = TEST_DATE;
  vm.total = 0;
  vm.filters = {};
  vm.isLoading = false;
  vm.isLoadingUpcoming = false;
  vm.error = null;
  vm.lastFetchTime = 0;
  vm.lastFiltersKey = '';
  vm._loadRequestId = 0;
  vm._upcomingRequestId = 0;
  vm._searchDebounceTimer = null;
  return vm;
}

function makeEvent(overrides: Partial<EventModel> = {}): EventModel {
  return {
    id: '1',
    eventDate: TEST_DATE,
    time: '10:00',
    title: 'US CPI',
    country: 'US',
    currency: 'USD',
    importance: 3,
    actual: '2.5%',
    forecast: '2.3%',
    previous: '2.1%',
    surprise: 'positive',
    url: null,
    aiAnalysis: null,
    isExpanded: false,
    isLoading: false,
    showAnalysis: false,
    importanceStars: '★★★',
    importanceColor: '#EF4444',
    hasData: true,
    surpriseIcon: '↑',
    ...overrides,
  };
}

beforeEach(() => {
  jest.clearAllMocks();
  jest.useFakeTimers();
});

afterEach(() => {
  jest.useRealTimers();
});

describe('EventsViewModel', () => {
  describe('setSearchFilter', () => {
    it('applies debounce of 300ms', () => {
      const vm = createViewModel();
      vm.allWeekEvents = [makeEvent(), makeEvent({ id: '2', title: 'German GDP', country: 'DE', currency: 'EUR' })];

      vm.setSearchFilter('test');
      expect(vm.filters.search).toBe('test');
      expect(vm.events).toEqual([]);

      // Fast-forward 300ms
      jest.advanceTimersByTime(300);

      expect(vm.events).toEqual([]);
      expect(vm.total).toBe(0);
    });

    it('cancels previous debounce on rapid typing', () => {
      const vm = createViewModel();
      vm.allWeekEvents = [makeEvent({ title: 'US Test Event' }), makeEvent({ id: '2', title: 'German GDP' })];

      vm.setSearchFilter('t');
      vm.setSearchFilter('te');
      vm.setSearchFilter('tes');
      vm.setSearchFilter('test');

      jest.advanceTimersByTime(300);

      expect(vm.events.map(event => event.id)).toEqual(['1']);
    });
  });

  describe('setImportanceFilter', () => {
    it('sets the importance filter and triggers load', () => {
      const vm = createViewModel();
      vm.allWeekEvents = [makeEvent({ importance: 3 }), makeEvent({ id: '2', importance: 1 })];
      vm.setImportanceFilter(3);
      expect(vm.filters.importance).toBe(3);
      expect(vm.events.map(event => event.id)).toEqual(['1']);
    });

    it('clears importance filter with undefined', () => {
      const vm = createViewModel();
      vm.allWeekEvents = [makeEvent({ importance: 3 }), makeEvent({ id: '2', importance: 1 })];
      vm.setImportanceFilter(3);
      vm.setImportanceFilter(undefined);
      expect(vm.filters.importance).toBeUndefined();
      expect(vm.events.map(event => event.id)).toEqual(['1', '2']);
    });
  });

  describe('setCountryFilter', () => {
    it('sets the country filter', () => {
      const vm = createViewModel();
      vm.allWeekEvents = [makeEvent({ country: 'US' }), makeEvent({ id: '2', country: 'DE' })];
      vm.setCountryFilter('US');
      expect(vm.filters.country).toBe('US');
      expect(vm.events.map(event => event.id)).toEqual(['1']);
    });
  });

  describe('clearFilters', () => {
    it('resets all filters', () => {
      const vm = createViewModel();
      vm.allWeekEvents = [makeEvent({ country: 'US' }), makeEvent({ id: '2', country: 'DE' })];
      vm.filters = { importance: 3, country: 'US', search: 'test' };
      vm.clearFilters();
      expect(vm.filters).toEqual({});
      expect(vm.events.map(event => event.id)).toEqual(['1', '2']);
    });
  });

  describe('reset', () => {
    it('resets all state', () => {
      const vm = createViewModel();
      vm.events = [{ id: '1' } as any];
      vm.total = 5;
      vm.error = 'some error';
      vm.filters = { importance: 3 };

      vm.reset();

      expect(vm.events).toEqual([]);
      expect(vm.total).toBe(0);
      expect(vm.error).toBeNull();
      expect(vm.filters).toEqual({});
    });
  });

  describe('toggleEventExpanded', () => {
    it('toggles the isExpanded flag', () => {
      const vm = createViewModel();
      vm.events = [
        { id: '1', isExpanded: false } as any,
        { id: '2', isExpanded: false } as any,
      ];
      vm.allWeekEvents = vm.events.map(event => makeEvent(event));

      vm.toggleEventExpanded('1');
      expect(vm.events[0].isExpanded).toBe(true);
      expect(vm.events[1].isExpanded).toBe(false);
    });
  });
});
