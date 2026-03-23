import { Alert } from '../../entities/Alert';
import { UpdateAlertParams } from '../repositories/UpdateAlertParams';

export interface IUpdateAlertUseCase {
  execute(alertId: string, params: UpdateAlertParams): Promise<Alert>;
}
