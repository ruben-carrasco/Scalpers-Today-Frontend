import { AlertCondition } from './AlertCondition';
import { AlertStatus } from './AlertStatus';

export interface Alert {
  id: string;
  name: string;
  description: string | null;
  conditions: AlertCondition[];
  status: AlertStatus;
  pushEnabled: boolean;
  triggerCount: number;
  lastTriggeredAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}
