export interface RegisterDeviceTokenParams {
  token: string;
  deviceType: 'ios' | 'android';
  deviceName?: string;
}
