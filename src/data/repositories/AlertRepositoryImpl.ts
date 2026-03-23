
import { injectable, inject } from 'inversify';
import { TYPES } from '../../core/types';
import { ApiClient } from '../api/ApiClient';
import { ApiEndpointProvider } from '../api/ApiEndpointProvider';
import { IAlertRepository } from '../../domain/interfaces/repositories/IAlertRepository';
import { CreateAlertParams } from '../../domain/interfaces/repositories/CreateAlertParams';
import { UpdateAlertParams } from '../../domain/interfaces/repositories/UpdateAlertParams';
import { DeviceToken } from '../../domain/interfaces/repositories/DeviceToken';
import { RegisterDeviceParams } from '../../domain/interfaces/repositories/RegisterDeviceParams';
import { Alert } from '../../domain/entities/Alert';
import { AlertCondition } from '../../domain/entities/AlertCondition';
import { AlertStatus } from '../../domain/entities/AlertStatus';
import { AlertType } from '../../domain/entities/AlertType';
import { ApiAlertCondition, ApiAlert, ApiDeviceToken } from './types';

@injectable()
export class AlertRepositoryImpl implements IAlertRepository {
  constructor(
    @inject(TYPES.ApiClient)
    private apiClient: ApiClient,
    @inject(TYPES.ApiEndpointProvider)
    private endpoints: ApiEndpointProvider
  ) {}

  private mapCondition(api: ApiAlertCondition): AlertCondition {
    return {
      alertType: api.alert_type as AlertType,
      value: api.value,
    };
  }

  private mapAlert(api: ApiAlert): Alert {
    return {
      id: api.id,
      name: api.name,
      description: api.description,
      conditions: api.conditions.map(c => this.mapCondition(c)),
      status: api.status as AlertStatus,
      pushEnabled: api.push_enabled,
      triggerCount: api.trigger_count,
      lastTriggeredAt: api.last_triggered_at ? new Date(api.last_triggered_at) : null,
      createdAt: new Date(api.created_at),
      updatedAt: new Date(api.updated_at),
    };
  }

  private mapDeviceToken(api: ApiDeviceToken): DeviceToken {
    return {
      id: api.id,
      deviceType: api.device_type as 'ios' | 'android',
      deviceName: api.device_name,
      isActive: api.is_active,
      createdAt: new Date(api.created_at),
      lastUsedAt: new Date(api.last_used_at),
    };
  }

  async createAlert(params: CreateAlertParams): Promise<Alert> {
    const body = {
      name: params.name,
      description: params.description,
      conditions: params.conditions.map(c => ({
        alert_type: c.alertType,
        value: c.value,
      })),
      push_enabled: params.pushEnabled ?? true,
    };
    if (__DEV__) console.log('[AlertRepository] Creating alert:', JSON.stringify(body, null, 2));
    const response = await this.apiClient.post<ApiAlert>(this.endpoints.alerts, body);
    console.log('[AlertRepository] Alert created:', response.id, 'Status:', response.status);
    return this.mapAlert(response);
  }

  async listAlerts(includeDeleted?: boolean): Promise<Alert[]> {
    const response = await this.apiClient.get<ApiAlert[]>(
      this.endpoints.alerts,
      includeDeleted ? { include_deleted: true } : undefined
    );
    return response.map(a => this.mapAlert(a));
  }

  async getAlert(alertId: string): Promise<Alert> {
    const response = await this.apiClient.get<ApiAlert>(this.endpoints.alert(alertId));
    return this.mapAlert(response);
  }

  async updateAlert(alertId: string, params: UpdateAlertParams): Promise<Alert> {
    const body: Record<string, any> = {};
    if (params.name !== undefined) body.name = params.name;
    if (params.description !== undefined) body.description = params.description;
    if (params.conditions !== undefined) {
      body.conditions = params.conditions.map(c => ({
        alert_type: c.alertType,
        value: c.value,
      }));
    }
    if (params.status !== undefined) body.status = params.status;
    if (params.pushEnabled !== undefined) body.push_enabled = params.pushEnabled;

    const response = await this.apiClient.put<ApiAlert>(this.endpoints.alert(alertId), body);
    return this.mapAlert(response);
  }

  async deleteAlert(alertId: string, hardDelete?: boolean): Promise<void> {
    await this.apiClient.delete(
      this.endpoints.alert(alertId),
      hardDelete ? { hard_delete: true } : undefined
    );
  }

  async registerDeviceToken(params: RegisterDeviceParams): Promise<DeviceToken> {
    const body = {
      token: params.token,
      device_type: params.deviceType,
      device_name: params.deviceName,
    };
    console.log('[AlertRepository] Registering device token:', params.deviceType);
    const response = await this.apiClient.post<ApiDeviceToken>(this.endpoints.deviceToken, body);
    console.log('[AlertRepository] Device token registered:', response.id, 'Active:', response.is_active);
    return this.mapDeviceToken(response);
  }

  async listDeviceTokens(activeOnly?: boolean): Promise<DeviceToken[]> {
    const response = await this.apiClient.get<ApiDeviceToken[]>(
      this.endpoints.deviceTokens,
      activeOnly !== undefined ? { active_only: activeOnly } : undefined
    );
    return response.map(t => this.mapDeviceToken(t));
  }
}
