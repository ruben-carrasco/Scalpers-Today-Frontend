export interface ApiDeviceToken {
  id: string;
  device_type: string;
  device_name: string | null;
  is_active: boolean;
  created_at: string;
  last_used_at: string;
}
