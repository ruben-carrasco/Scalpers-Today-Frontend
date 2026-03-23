import { ApiEvent } from './ApiEvent';

export interface ApiUpcomingResponse {
  current_time: string;
  count: number;
  events: ApiEvent[];
}
