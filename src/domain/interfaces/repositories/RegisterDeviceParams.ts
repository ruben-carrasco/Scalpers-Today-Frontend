export interface RegisterDeviceParams {
  token: string;
  deviceType: 'ios' | 'android';
  deviceName?: string;
}
