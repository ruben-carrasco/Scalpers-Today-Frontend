import { DeviceToken } from '../repositories/DeviceToken';
import { RegisterDeviceTokenParams } from './RegisterDeviceTokenParams';

export interface IRegisterDeviceTokenUseCase {
  execute(params: RegisterDeviceTokenParams): Promise<DeviceToken>;
}
