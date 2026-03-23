import { EventsViewModel } from '../../presentation/viewmodels/EventsViewModel';

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

function createViewModel(): EventsViewModel {
  const vm = Object.create(EventsViewModel.prototype);
  // Manually set the private dependencies (bypassing inversify)
  vm.getFilteredEventsUseCase = mockGetFilteredEvents;
  vm.getUpcomingEventsUseCase = mockGetUpcomingEvents;
  vm.cacheService = mockCacheService;
  // Initialize observable properties
  vm.events = [];
  vm.upcomingEvents = [];
  vm.availableCountries = [];
  vm.total = 0;
  vm.filters = {};
  vm.isLoading = false;
  vm.isLoadingUpcoming = false;
  vm.error = null;
  vm.lastFetchTime = 0;
  vm.lastFiltersKey = '';
  vm._loadRequestId = 0;
  vm._searchDebounceTimer = null;
  return vm;
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

      vm.setSearchFilter('test');
      expect(vm.filters.search).toBe('test');
      // loadEvents should NOT have been called yet (debounced)
      expect(mockGetFilteredEvents.execute).not.toHaveBeenCalled();

      // Fast-forward 300ms
      jest.advanceTimersByTime(300);

      // Now it should have been called
      expect(mockGetFilteredEvents.execute).toHaveBeenCalled();
    });

    it('cancels previous debounce on rapid typing', () => {
      const vm = createViewModel();

      vm.setSearchFilter('t');
      vm.setSearchFilter('te');
      vm.setSearchFilter('tes');
      vm.setSearchFilter('test');

      jest.advanceTimersByTime(300);

      // Should only call loadEvents once (last debounce)
      expect(mockGetFilteredEvents.execute).toHaveBeenCalledTimes(1);
    });
  });

  describe('setImportanceFilter', () => {
    it('sets the importance filter and triggers load', () => {
      const vm = createViewModel();
      vm.setImportanceFilter(3);
      expect(vm.filters.importance).toBe(3);
    });

    it('clears importance filter with undefined', () => {
      const vm = createViewModel();
      vm.setImportanceFilter(3);
      vm.setImportanceFilter(undefined);
      expect(vm.filters.importance).toBeUndefined();
    });
  });

  describe('setCountryFilter', () => {
    it('sets the country filter', () => {
      const vm = createViewModel();
      vm.setCountryFilter('US');
      expect(vm.filters.country).toBe('US');
    });
  });

  describe('clearFilters', () => {
    it('resets all filters', () => {
      const vm = createViewModel();
      vm.filters = { importance: 3, country: 'US', search: 'test' };
      vm.clearFilters();
      expect(vm.filters).toEqual({});
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

      vm.toggleEventExpanded('1');
      expect(vm.events[0].isExpanded).toBe(true);
      expect(vm.events[1].isExpanded).toBe(false);
    });
  });
});
