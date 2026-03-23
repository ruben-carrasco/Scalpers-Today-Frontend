import { injectable, inject } from 'inversify';
import { TYPES } from '../../../core/types';
import { IGetUpcomingEventsUseCase } from '../../interfaces/usecases/IGetUpcomingEventsUseCase';
import { IEventRepository } from '../../interfaces/repositories/IEventRepository';
import { UpcomingEventsResult } from '../../interfaces/repositories/UpcomingEventsResult';

@injectable()
export class GetUpcomingEventsUseCase implements IGetUpcomingEventsUseCase {
  constructor(
    @inject(TYPES.EventRepository)
    private eventRepository: IEventRepository
  ) {}

  async execute(limit?: number): Promise<UpcomingEventsResult> {
    return this.eventRepository.getUpcomingEvents(limit);
  }
}
