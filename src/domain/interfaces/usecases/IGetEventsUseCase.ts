import { EconomicEvent } from '../../entities/EconomicEvent';

export interface IGetEventsUseCase {
  execute(): Promise<EconomicEvent[]>;
}
