
import { Platform } from 'react-native';
import { injectable, inject } from 'inversify';
import { makeAutoObservable, runInAction } from 'mobx';
import { TYPES } from '../../core/types';
import { ILoginUseCase } from '../../domain/interfaces/usecases/ILoginUseCase';
import { IRegisterUseCase } from '../../domain/interfaces/usecases/IRegisterUseCase';
import { IGetCurrentUserUseCase } from '../../domain/interfaces/usecases/IGetCurrentUserUseCase';
import { ILogoutUseCase } from '../../domain/interfaces/usecases/ILogoutUseCase';
import { IRegisterDeviceTokenUseCase } from '../../domain/interfaces/usecases/IRegisterDeviceTokenUseCase';
import { UserModel, createUserModel } from '../models/UserModel';
import { notificationService } from '../../services/NotificationService';
import { HomeViewModel } from './HomeViewModel';
import { EventsViewModel } from './EventsViewModel';
import { AlertsViewModel } from './AlertsViewModel';
import { SettingsViewModel } from './SettingsViewModel';
import {
  NetworkError,
  AuthError,
  ValidationError,
  ApiError,
  translateApiError,
} from '../../core/errors';

@injectable()
export class AuthViewModel {
  user: UserModel | null = null;
  isLoading: boolean = false;
  isAuthenticated: boolean = false;
  error: string | null = null;
  pushToken: string | null = null;
  private _registeringPushToken: boolean = false;

  constructor(
    @inject(TYPES.LoginUseCase)
    private loginUseCase: ILoginUseCase,
    @inject(TYPES.RegisterUseCase)
    private registerUseCase: IRegisterUseCase,
    @inject(TYPES.GetCurrentUserUseCase)
    private getCurrentUserUseCase: IGetCurrentUserUseCase,
    @inject(TYPES.LogoutUseCase)
    private logoutUseCase: ILogoutUseCase,
    @inject(TYPES.RegisterDeviceTokenUseCase)
    private registerDeviceTokenUseCase: IRegisterDeviceTokenUseCase,
    @inject(TYPES.HomeViewModel)
    private homeViewModel: HomeViewModel,
    @inject(TYPES.EventsViewModel)
    private eventsViewModel: EventsViewModel,
    @inject(TYPES.AlertsViewModel)
    private alertsViewModel: AlertsViewModel,
    @inject(TYPES.SettingsViewModel)
    private settingsViewModel: SettingsViewModel
  ) {
    makeAutoObservable(this, {
      _registeringPushToken: false,
    } as Record<string, boolean>);
  }

  private async registerPushToken(): Promise<void> {
    if (this._registeringPushToken) return;
    this._registeringPushToken = true;
    try {
      const token = await notificationService.registerForPushNotifications();
      if (token) {
        const deviceType = Platform.OS === 'ios' ? 'ios' : 'android';
        await this.registerDeviceTokenUseCase.execute({
          token,
          deviceType,
          deviceName: `${Platform.OS} ${Platform.Version}`,
        });
        runInAction(() => {
          this.pushToken = token;
        });
        if (__DEV__) console.log('Push token registered successfully');
      }
    } catch (error) {
      if (__DEV__) console.error('Error registering push token:', error);
    } finally {
      this._registeringPushToken = false;
    }
  }

  async checkAuth(): Promise<void> {
    this.isLoading = true;
    this.error = null;

    try {
      const user = await this.getCurrentUserUseCase.execute();
      runInAction(() => {
        if (user) {
          this.user = createUserModel(user);
          this.isAuthenticated = true;
        } else {
          this.user = null;
          this.isAuthenticated = false;
        }
      });
    } catch {
      runInAction(() => {
        this.user = null;
        this.isAuthenticated = false;
      });
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  }

  async login(email: string, password: string): Promise<boolean> {
    this.isLoading = true;
    this.error = null;

    try {
      const result = await this.loginUseCase.execute({ email, password });
      runInAction(() => {
        this.user = createUserModel(result.user);
        this.isAuthenticated = true;
      });
      this.registerPushToken();
      return true;
    } catch (err) {
      runInAction(() => {
        if (err instanceof NetworkError) {
          this.error = 'Sin conexión a internet. Verifica tu conexión.';
        } else if (err instanceof AuthError) {
          this.error = 'Credenciales incorrectas. Verifica tu email y contraseña.';
        } else if (err instanceof ApiError) {
          this.error = translateApiError(err.message);
        } else if (err instanceof Error) {
          this.error = translateApiError(err.message);
        } else {
          this.error = 'Ha ocurrido un error inesperado. Intenta de nuevo.';
        }
      });
      return false;
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  }

  async register(
    email: string,
    password: string,
    name: string,
    language?: string,
    currency?: string
  ): Promise<boolean> {
    this.isLoading = true;
    this.error = null;

    try {
      const result = await this.registerUseCase.execute({
        email,
        password,
        name,
        language,
        currency,
      });
      runInAction(() => {
        this.user = createUserModel(result.user);
        this.isAuthenticated = true;
      });
      this.registerPushToken();
      return true;
    } catch (err) {
      runInAction(() => {
        if (err instanceof NetworkError) {
          this.error = 'Sin conexión a internet. Verifica tu conexión.';
        } else if (err instanceof ValidationError) {
          this.error = translateApiError(err.message);
        } else if (err instanceof ApiError) {
          this.error = translateApiError(err.message);
        } else if (err instanceof Error) {
          this.error = translateApiError(err.message);
        } else {
          this.error = 'Ha ocurrido un error inesperado. Intenta de nuevo.';
        }
      });
      return false;
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  }

  async logout(): Promise<void> {
    await this.logoutUseCase.execute();
    runInAction(() => {
      this.user = null;
      this.isAuthenticated = false;
      this.pushToken = null;
    });
    this.homeViewModel.reset();
    this.eventsViewModel.reset();
    this.alertsViewModel.reset();
    this.settingsViewModel.reset();
  }

  clearError(): void {
    this.error = null;
  }
}
