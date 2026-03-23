import { Alert } from '../../entities/Alert';
import { CreateAlertParams } from './CreateAlertParams';
import { UpdateAlertParams } from './UpdateAlertParams';
import { DeviceToken } from './DeviceToken';
import { RegisterDeviceParams } from './RegisterDeviceParams';

export interface IAlertRepository {
  createAlert(params: CreateAlertParams): Promise<Alert>;
  listAlerts(includeDeleted?: boolean): Promise<Alert[]>;
  getAlert(alertId: string): Promise<Alert>;
  updateAlert(alertId: string, params: UpdateAlertParams): Promise<Alert>;
  deleteAlert(alertId: string, hardDelete?: boolean): Promise<void>;
  registerDeviceToken(params: RegisterDeviceParams): Promise<DeviceToken>;
  listDeviceTokens(activeOnly?: boolean): Promise<DeviceToken[]>;
}
