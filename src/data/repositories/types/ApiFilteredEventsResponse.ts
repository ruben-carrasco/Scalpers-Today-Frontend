import { ApiEvent } from './ApiEvent';

export interface ApiFilteredEventsResponse {
  total: number;
  filters_applied: {
    importance: number | null;
    country: string | null;
    has_data: boolean | null;
    search: string | null;
  };
  events: ApiEvent[];
}
