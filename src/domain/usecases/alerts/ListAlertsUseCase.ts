import { injectable, inject } from 'inversify';
import { TYPES } from '../../../core/types';
import { IListAlertsUseCase } from '../../interfaces/usecases/IListAlertsUseCase';
import { IAlertRepository } from '../../interfaces/repositories/IAlertRepository';
import { Alert } from '../../entities/Alert';

@injectable()
export class ListAlertsUseCase implements IListAlertsUseCase {
  constructor(
    @inject(TYPES.AlertRepository)
    private alertRepository: IAlertRepository
  ) {}

  async execute(includeDeleted?: boolean): Promise<Alert[]> {
    return this.alertRepository.listAlerts(includeDeleted);
  }
}
