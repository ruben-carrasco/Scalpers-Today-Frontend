import { AlertCondition } from '../../entities/AlertCondition';

export interface CreateAlertParams {
  name: string;
  description?: string;
  conditions: AlertCondition[];
  pushEnabled?: boolean;
}
