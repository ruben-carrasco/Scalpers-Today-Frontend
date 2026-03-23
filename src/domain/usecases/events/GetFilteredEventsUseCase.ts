import { injectable, inject } from 'inversify';
import { TYPES } from '../../../core/types';
import { IGetFilteredEventsUseCase } from '../../interfaces/usecases/IGetFilteredEventsUseCase';
import { IEventRepository } from '../../interfaces/repositories/IEventRepository';
import { EventFilters } from '../../interfaces/repositories/EventFilters';
import { FilteredEventsResult } from '../../interfaces/repositories/FilteredEventsResult';

@injectable()
export class GetFilteredEventsUseCase implements IGetFilteredEventsUseCase {
  constructor(
    @inject(TYPES.EventRepository)
    private eventRepository: IEventRepository
  ) {}

  async execute(filters?: EventFilters): Promise<FilteredEventsResult> {
    return this.eventRepository.getFilteredEvents(filters);
  }
}
