import { ApiAlertCondition } from './ApiAlertCondition';

export interface ApiAlert {
  id: string;
  name: string;
  description: string | null;
  conditions: ApiAlertCondition[];
  status: string;
  push_enabled: boolean;
  trigger_count: number;
  last_triggered_at: string | null;
  created_at: string;
  updated_at: string;
}
