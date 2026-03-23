import { injectable, inject } from 'inversify';
import { TYPES } from '../../../core/types';
import { IGetEventsUseCase } from '../../interfaces/usecases/IGetEventsUseCase';
import { IEventRepository } from '../../interfaces/repositories/IEventRepository';
import { EconomicEvent } from '../../entities/EconomicEvent';

@injectable()
export class GetEventsUseCase implements IGetEventsUseCase {
  constructor(
    @inject(TYPES.EventRepository)
    private eventRepository: IEventRepository
  ) {}

  async execute(): Promise<EconomicEvent[]> {
    return this.eventRepository.getAllEvents();
  }
}
