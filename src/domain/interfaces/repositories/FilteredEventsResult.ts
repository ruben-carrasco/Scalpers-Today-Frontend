import { EventFilters } from './EventFilters';
import { EconomicEvent } from '../../entities/EconomicEvent';

export interface FilteredEventsResult {
  total: number;
  filtersApplied: EventFilters;
  events: EconomicEvent[];
}
