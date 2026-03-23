import { Alert } from '../../entities/Alert';
import { CreateAlertParams } from '../repositories/CreateAlertParams';

export interface ICreateAlertUseCase {
  execute(params: CreateAlertParams): Promise<Alert>;
}
