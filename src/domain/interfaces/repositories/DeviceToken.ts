export interface DeviceToken {
  id: string;
  deviceType: 'ios' | 'android';
  deviceName: string | null;
  isActive: boolean;
  createdAt: Date;
  lastUsedAt: Date;
}
