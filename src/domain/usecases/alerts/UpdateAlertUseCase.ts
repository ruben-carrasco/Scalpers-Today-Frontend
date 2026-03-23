import { injectable, inject } from 'inversify';
import { TYPES } from '../../../core/types';
import { IUpdateAlertUseCase } from '../../interfaces/usecases/IUpdateAlertUseCase';
import { IAlertRepository } from '../../interfaces/repositories/IAlertRepository';
import { UpdateAlertParams } from '../../interfaces/repositories/UpdateAlertParams';
import { Alert } from '../../entities/Alert';

@injectable()
export class UpdateAlertUseCase implements IUpdateAlertUseCase {
  constructor(
    @inject(TYPES.AlertRepository)
    private alertRepository: IAlertRepository
  ) {}

  async execute(alertId: string, params: UpdateAlertParams): Promise<Alert> {
    return this.alertRepository.updateAlert(alertId, params);
  }
}
