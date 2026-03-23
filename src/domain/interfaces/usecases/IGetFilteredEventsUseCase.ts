import { EventFilters } from '../repositories/EventFilters';
import { FilteredEventsResult } from '../repositories/FilteredEventsResult';

export interface IGetFilteredEventsUseCase {
  execute(filters?: EventFilters): Promise<FilteredEventsResult>;
}
