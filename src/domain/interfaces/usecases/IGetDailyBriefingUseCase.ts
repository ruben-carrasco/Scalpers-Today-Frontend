import { DailyBriefing } from '../../entities/DailyBriefing';

export interface IGetDailyBriefingUseCase {
  execute(): Promise<DailyBriefing>;
}
