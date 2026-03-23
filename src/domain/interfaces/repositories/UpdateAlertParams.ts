import { AlertCondition } from '../../entities/AlertCondition';
import { AlertStatus } from '../../entities/AlertStatus';

export interface UpdateAlertParams {
  name?: string;
  description?: string;
  conditions?: AlertCondition[];
  status?: AlertStatus;
  pushEnabled?: boolean;
}
