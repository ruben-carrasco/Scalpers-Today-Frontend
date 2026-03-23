import { UpcomingEventsResult } from '../repositories/UpcomingEventsResult';

export interface IGetUpcomingEventsUseCase {
  execute(limit?: number): Promise<UpcomingEventsResult>;
}
