
import { injectable, inject } from 'inversify';
import { TYPES } from '../../../core/types';
import { IRegisterDeviceTokenUseCase } from '../../interfaces/usecases/IRegisterDeviceTokenUseCase';
import { RegisterDeviceTokenParams } from '../../interfaces/usecases/RegisterDeviceTokenParams';
import { IAlertRepository } from '../../interfaces/repositories/IAlertRepository';
import { DeviceToken } from '../../interfaces/repositories/DeviceToken';

@injectable()
export class RegisterDeviceTokenUseCase implements IRegisterDeviceTokenUseCase {
  constructor(
    @inject(TYPES.AlertRepository)
    private alertRepository: IAlertRepository
  ) {}

  async execute(params: RegisterDeviceTokenParams): Promise<DeviceToken> {
    if (!params.token.trim()) {
      throw new Error('El token del dispositivo es obligatorio');
    }

    if (!['ios', 'android'].includes(params.deviceType)) {
      throw new Error('Tipo de dispositivo inválido');
    }

    return this.alertRepository.registerDeviceToken({
      token: params.token,
      deviceType: params.deviceType,
      deviceName: params.deviceName,
    });
  }
}
