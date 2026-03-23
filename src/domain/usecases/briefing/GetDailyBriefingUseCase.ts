import { injectable, inject } from 'inversify';
import { TYPES } from '../../../core/types';
import { IGetDailyBriefingUseCase } from '../../interfaces/usecases/IGetDailyBriefingUseCase';
import { IEventRepository } from '../../interfaces/repositories/IEventRepository';
import { DailyBriefing } from '../../entities/DailyBriefing';

@injectable()
export class GetDailyBriefingUseCase implements IGetDailyBriefingUseCase {
  constructor(
    @inject(TYPES.EventRepository)
    private eventRepository: IEventRepository
  ) {}

  async execute(): Promise<DailyBriefing> {
    return this.eventRepository.getDailyBriefing();
  }
}
