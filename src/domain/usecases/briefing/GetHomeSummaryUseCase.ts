import { injectable, inject } from 'inversify';
import { TYPES } from '../../../core/types';
import { IGetHomeSummaryUseCase } from '../../interfaces/usecases/IGetHomeSummaryUseCase';
import { IEventRepository } from '../../interfaces/repositories/IEventRepository';
import { HomeSummary } from '../../entities/HomeSummary';

@injectable()
export class GetHomeSummaryUseCase implements IGetHomeSummaryUseCase {
  constructor(
    @inject(TYPES.EventRepository)
    private eventRepository: IEventRepository
  ) {}

  async execute(): Promise<HomeSummary> {
    return this.eventRepository.getHomeSummary();
  }
}
