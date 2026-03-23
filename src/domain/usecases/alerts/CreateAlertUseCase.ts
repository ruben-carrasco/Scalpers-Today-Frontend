import { injectable, inject } from 'inversify';
import { TYPES } from '../../../core/types';
import { ICreateAlertUseCase } from '../../interfaces/usecases/ICreateAlertUseCase';
import { IAlertRepository } from '../../interfaces/repositories/IAlertRepository';
import { CreateAlertParams } from '../../interfaces/repositories/CreateAlertParams';
import { Alert } from '../../entities/Alert';

@injectable()
export class CreateAlertUseCase implements ICreateAlertUseCase {
  constructor(
    @inject(TYPES.AlertRepository)
    private alertRepository: IAlertRepository
  ) {}

  async execute(params: CreateAlertParams): Promise<Alert> {
    if (!params.name.trim()) {
      throw new Error('El nombre de la alerta es obligatorio');
    }
    if (params.conditions.length === 0) {
      throw new Error('Debe incluir al menos una condición');
    }
    return this.alertRepository.createAlert(params);
  }
}
