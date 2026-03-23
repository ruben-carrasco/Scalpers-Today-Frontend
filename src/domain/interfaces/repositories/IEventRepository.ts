import { EconomicEvent } from '../../entities/EconomicEvent';
import { EventFilters } from './EventFilters';
import { FilteredEventsResult } from './FilteredEventsResult';
import { UpcomingEventsResult } from './UpcomingEventsResult';
import { HomeSummary } from '../../entities/HomeSummary';
import { DailyBriefing } from '../../entities/DailyBriefing';

export interface IEventRepository {
  getAllEvents(): Promise<EconomicEvent[]>;
  getFilteredEvents(filters?: EventFilters): Promise<FilteredEventsResult>;
  getEventsByImportance(importance: number): Promise<EconomicEvent[]>;
  getUpcomingEvents(limit?: number): Promise<UpcomingEventsResult>;
  getHomeSummary(): Promise<HomeSummary>;
  getDailyBriefing(): Promise<DailyBriefing>;
}
