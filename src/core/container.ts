
import 'reflect-metadata';
import { Container } from 'inversify';
import { TYPES } from './types';

import { TokenManager, ITokenManager } from './storage/TokenManager';

import { ApiClient } from '../data/api/ApiClient';
import { ApiEndpointProvider } from '../data/api/ApiEndpointProvider';

import { IAuthRepository } from '../domain/interfaces/repositories/IAuthRepository';
import { IEventRepository } from '../domain/interfaces/repositories/IEventRepository';
import { IAlertRepository } from '../domain/interfaces/repositories/IAlertRepository';
import { IConfigRepository } from '../domain/interfaces/repositories/IConfigRepository';

import { AuthRepositoryImpl } from '../data/repositories/AuthRepositoryImpl';
import { EventRepositoryImpl } from '../data/repositories/EventRepositoryImpl';
import { AlertRepositoryImpl } from '../data/repositories/AlertRepositoryImpl';
import { ConfigRepositoryImpl } from '../data/repositories/ConfigRepositoryImpl';

import { ILoginUseCase } from '../domain/interfaces/usecases/ILoginUseCase';
import { IRegisterUseCase } from '../domain/interfaces/usecases/IRegisterUseCase';
import { IGetCurrentUserUseCase } from '../domain/interfaces/usecases/IGetCurrentUserUseCase';
import { ILogoutUseCase } from '../domain/interfaces/usecases/ILogoutUseCase';

import { LoginUseCase } from '../domain/usecases/auth/LoginUseCase';
import { RegisterUseCase } from '../domain/usecases/auth/RegisterUseCase';
import { GetCurrentUserUseCase } from '../domain/usecases/auth/GetCurrentUserUseCase';
import { LogoutUseCase } from '../domain/usecases/auth/LogoutUseCase';

import { IGetEventsUseCase } from '../domain/interfaces/usecases/IGetEventsUseCase';
import { IGetFilteredEventsUseCase } from '../domain/interfaces/usecases/IGetFilteredEventsUseCase';
import { IGetUpcomingEventsUseCase } from '../domain/interfaces/usecases/IGetUpcomingEventsUseCase';

import { GetEventsUseCase } from '../domain/usecases/events/GetEventsUseCase';
import { GetFilteredEventsUseCase } from '../domain/usecases/events/GetFilteredEventsUseCase';
import { GetUpcomingEventsUseCase } from '../domain/usecases/events/GetUpcomingEventsUseCase';

import { IGetHomeSummaryUseCase } from '../domain/interfaces/usecases/IGetHomeSummaryUseCase';
import { IGetDailyBriefingUseCase } from '../domain/interfaces/usecases/IGetDailyBriefingUseCase';

import { GetHomeSummaryUseCase } from '../domain/usecases/briefing/GetHomeSummaryUseCase';
import { GetDailyBriefingUseCase } from '../domain/usecases/briefing/GetDailyBriefingUseCase';

import { ICreateAlertUseCase } from '../domain/interfaces/usecases/ICreateAlertUseCase';
import { IListAlertsUseCase } from '../domain/interfaces/usecases/IListAlertsUseCase';
import { IUpdateAlertUseCase } from '../domain/interfaces/usecases/IUpdateAlertUseCase';
import { IDeleteAlertUseCase } from '../domain/interfaces/usecases/IDeleteAlertUseCase';
import { IRegisterDeviceTokenUseCase } from '../domain/interfaces/usecases/IRegisterDeviceTokenUseCase';

import { CreateAlertUseCase } from '../domain/usecases/alerts/CreateAlertUseCase';
import { ListAlertsUseCase } from '../domain/usecases/alerts/ListAlertsUseCase';
import { UpdateAlertUseCase } from '../domain/usecases/alerts/UpdateAlertUseCase';
import { DeleteAlertUseCase } from '../domain/usecases/alerts/DeleteAlertUseCase';
import { RegisterDeviceTokenUseCase } from '../domain/usecases/alerts/RegisterDeviceTokenUseCase';

import { IGetCountriesUseCase } from '../domain/interfaces/usecases/IGetCountriesUseCase';
import { GetCountriesUseCase } from '../domain/usecases/config/GetCountriesUseCase';

import { AuthViewModel } from '../presentation/viewmodels/AuthViewModel';
import { HomeViewModel } from '../presentation/viewmodels/HomeViewModel';
import { EventsViewModel } from '../presentation/viewmodels/EventsViewModel';
import { AlertsViewModel } from '../presentation/viewmodels/AlertsViewModel';
import { SettingsViewModel } from '../presentation/viewmodels/SettingsViewModel';
import { CacheService } from '../services/CacheService';

const container = new Container();

container.bind<ITokenManager>(TYPES.TokenManager)
  .to(TokenManager)
  .inSingletonScope();

container.bind<CacheService>(TYPES.CacheService)
  .to(CacheService)
  .inSingletonScope();

container.bind<ApiEndpointProvider>(TYPES.ApiEndpointProvider)
  .to(ApiEndpointProvider)
  .inSingletonScope();

container.bind<ApiClient>(TYPES.ApiClient)
  .to(ApiClient)
  .inSingletonScope();

container.bind<IAuthRepository>(TYPES.AuthRepository)
  .to(AuthRepositoryImpl)
  .inSingletonScope();

container.bind<IEventRepository>(TYPES.EventRepository)
  .to(EventRepositoryImpl)
  .inSingletonScope();

container.bind<IAlertRepository>(TYPES.AlertRepository)
  .to(AlertRepositoryImpl)
  .inSingletonScope();

container.bind<IConfigRepository>(TYPES.ConfigRepository)
  .to(ConfigRepositoryImpl)
  .inSingletonScope();

container.bind<ILoginUseCase>(TYPES.LoginUseCase)
  .to(LoginUseCase)
  .inTransientScope();

container.bind<IRegisterUseCase>(TYPES.RegisterUseCase)
  .to(RegisterUseCase)
  .inTransientScope();

container.bind<IGetCurrentUserUseCase>(TYPES.GetCurrentUserUseCase)
  .to(GetCurrentUserUseCase)
  .inTransientScope();

container.bind<ILogoutUseCase>(TYPES.LogoutUseCase)
  .to(LogoutUseCase)
  .inTransientScope();

container.bind<IGetEventsUseCase>(TYPES.GetEventsUseCase)
  .to(GetEventsUseCase)
  .inTransientScope();

container.bind<IGetFilteredEventsUseCase>(TYPES.GetFilteredEventsUseCase)
  .to(GetFilteredEventsUseCase)
  .inTransientScope();

container.bind<IGetUpcomingEventsUseCase>(TYPES.GetUpcomingEventsUseCase)
  .to(GetUpcomingEventsUseCase)
  .inTransientScope();

container.bind<IGetHomeSummaryUseCase>(TYPES.GetHomeSummaryUseCase)
  .to(GetHomeSummaryUseCase)
  .inTransientScope();

container.bind<IGetDailyBriefingUseCase>(TYPES.GetDailyBriefingUseCase)
  .to(GetDailyBriefingUseCase)
  .inTransientScope();

container.bind<ICreateAlertUseCase>(TYPES.CreateAlertUseCase)
  .to(CreateAlertUseCase)
  .inTransientScope();

container.bind<IListAlertsUseCase>(TYPES.ListAlertsUseCase)
  .to(ListAlertsUseCase)
  .inTransientScope();

container.bind<IUpdateAlertUseCase>(TYPES.UpdateAlertUseCase)
  .to(UpdateAlertUseCase)
  .inTransientScope();

container.bind<IDeleteAlertUseCase>(TYPES.DeleteAlertUseCase)
  .to(DeleteAlertUseCase)
  .inTransientScope();

container.bind<IRegisterDeviceTokenUseCase>(TYPES.RegisterDeviceTokenUseCase)
  .to(RegisterDeviceTokenUseCase)
  .inTransientScope();

container.bind<IGetCountriesUseCase>(TYPES.GetCountriesUseCase)
  .to(GetCountriesUseCase)
  .inTransientScope();

container.bind<AuthViewModel>(TYPES.AuthViewModel)
  .to(AuthViewModel)
  .inSingletonScope();

container.bind<HomeViewModel>(TYPES.HomeViewModel)
  .to(HomeViewModel)
  .inSingletonScope();

container.bind<EventsViewModel>(TYPES.EventsViewModel)
  .to(EventsViewModel)
  .inSingletonScope();

container.bind<AlertsViewModel>(TYPES.AlertsViewModel)
  .to(AlertsViewModel)
  .inSingletonScope();

container.bind<SettingsViewModel>(TYPES.SettingsViewModel)
  .to(SettingsViewModel)
  .inSingletonScope();

export { container };
