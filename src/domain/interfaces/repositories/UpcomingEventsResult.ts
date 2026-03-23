import { EconomicEvent } from '../../entities/EconomicEvent';

export interface UpcomingEventsResult {
  currentTime: string;
  count: number;
  events: EconomicEvent[];
}
