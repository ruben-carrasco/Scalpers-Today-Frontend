
export const TYPES = {
  TokenManager: Symbol.for('TokenManager'),

  ApiClient: Symbol.for('ApiClient'),
  ApiEndpointProvider: Symbol.for('ApiEndpointProvider'),

  AuthRepository: Symbol.for('AuthRepository'),
  EventRepository: Symbol.for('EventRepository'),
  AlertRepository: Symbol.for('AlertRepository'),
  ConfigRepository: Symbol.for('ConfigRepository'),

  LoginUseCase: Symbol.for('LoginUseCase'),
  GoogleLoginUseCase: Symbol.for('GoogleLoginUseCase'),
  RegisterUseCase: Symbol.for('RegisterUseCase'),
  GetCurrentUserUseCase: Symbol.for('GetCurrentUserUseCase'),
  LogoutUseCase: Symbol.for('LogoutUseCase'),

  GetEventsUseCase: Symbol.for('GetEventsUseCase'),
  GetFilteredEventsUseCase: Symbol.for('GetFilteredEventsUseCase'),
  GetUpcomingEventsUseCase: Symbol.for('GetUpcomingEventsUseCase'),

  GetHomeSummaryUseCase: Symbol.for('GetHomeSummaryUseCase'),
  GetDailyBriefingUseCase: Symbol.for('GetDailyBriefingUseCase'),

  CreateAlertUseCase: Symbol.for('CreateAlertUseCase'),
  ListAlertsUseCase: Symbol.for('ListAlertsUseCase'),
  UpdateAlertUseCase: Symbol.for('UpdateAlertUseCase'),
  DeleteAlertUseCase: Symbol.for('DeleteAlertUseCase'),

  RegisterDeviceTokenUseCase: Symbol.for('RegisterDeviceTokenUseCase'),

  GetCountriesUseCase: Symbol.for('GetCountriesUseCase'),

  AuthViewModel: Symbol.for('AuthViewModel'),
  HomeViewModel: Symbol.for('HomeViewModel'),
  EventsViewModel: Symbol.for('EventsViewModel'),
  AlertsViewModel: Symbol.for('AlertsViewModel'),
  SettingsViewModel: Symbol.for('SettingsViewModel'),

  CacheService: Symbol.for('CacheService'),
};
