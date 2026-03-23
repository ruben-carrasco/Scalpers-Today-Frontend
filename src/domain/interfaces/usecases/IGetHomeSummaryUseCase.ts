import { HomeSummary } from '../../entities/HomeSummary';

export interface IGetHomeSummaryUseCase {
  execute(): Promise<HomeSummary>;
}
