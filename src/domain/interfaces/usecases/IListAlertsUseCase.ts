import { Alert } from '../../entities/Alert';

export interface IListAlertsUseCase {
  execute(includeDeleted?: boolean): Promise<Alert[]>;
}
