import { AlertType } from './AlertType';

export interface AlertCondition {
  alertType: AlertType;
  value: string | null;
}
