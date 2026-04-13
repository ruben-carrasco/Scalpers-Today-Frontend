
import { injectable, inject } from 'inversify';
import { makeAutoObservable, runInAction } from 'mobx';
import { TYPES } from '../../core/types';
import { ICreateAlertUseCase } from '../../domain/interfaces/usecases/ICreateAlertUseCase';
import { IListAlertsUseCase } from '../../domain/interfaces/usecases/IListAlertsUseCase';
import { IUpdateAlertUseCase } from '../../domain/interfaces/usecases/IUpdateAlertUseCase';
import { IDeleteAlertUseCase } from '../../domain/interfaces/usecases/IDeleteAlertUseCase';
import { CreateAlertParams } from '../../domain/interfaces/repositories/CreateAlertParams';
import { UpdateAlertParams } from '../../domain/interfaces/repositories/UpdateAlertParams';
import { AlertModel, createAlertModel } from '../models/AlertModel';
import { NetworkError, getErrorMessage } from '../../core/errors';

@injectable()
export class AlertsViewModel {
  alerts: AlertModel[] = [];
  isLoading: boolean = false;
  isCreating: boolean = false;
  includeDeleted: boolean = false;
  error: string | null = null;
  private _loadRequestId: number = 0;

  constructor(
    @inject(TYPES.CreateAlertUseCase)
    private createAlertUseCase: ICreateAlertUseCase,
    @inject(TYPES.ListAlertsUseCase)
    private listAlertsUseCase: IListAlertsUseCase,
    @inject(TYPES.UpdateAlertUseCase)
    private updateAlertUseCase: IUpdateAlertUseCase,
    @inject(TYPES.DeleteAlertUseCase)
    private deleteAlertUseCase: IDeleteAlertUseCase
  ) {
    makeAutoObservable(this, {
      _loadRequestId: false,
    } as Record<string, boolean>);
  }

  async loadAlerts(): Promise<void> {
    const requestId = ++this._loadRequestId;
    this.isLoading = true;
    this.error = null;

    try {
      const alerts = await this.listAlertsUseCase.execute(this.includeDeleted);
      runInAction(() => {
        if (requestId !== this._loadRequestId) return;
        this.alerts = alerts.map(a => createAlertModel(a));
      });
    } catch (err) {
      runInAction(() => {
        if (requestId !== this._loadRequestId) return;
        if (err instanceof NetworkError) {
          this.error = 'Sin conexión a internet.';
        } else {
          this.error = getErrorMessage(err);
        }
      });
    } finally {
      runInAction(() => {
        if (requestId !== this._loadRequestId) return;
        this.isLoading = false;
      });
    }
  }

  async createAlert(params: CreateAlertParams): Promise<boolean> {
    this.isCreating = true;
    this.error = null;

    try {
      const alert = await this.createAlertUseCase.execute(params);
      runInAction(() => {
        this.alerts = [createAlertModel(alert), ...this.alerts];
      });
      return true;
    } catch (err) {
      runInAction(() => {
        if (err instanceof NetworkError) {
          this.error = 'Sin conexión a internet.';
        } else {
          this.error = getErrorMessage(err);
        }
      });
      return false;
    } finally {
      runInAction(() => {
        this.isCreating = false;
      });
    }
  }

  async updateAlert(alertId: string, params: UpdateAlertParams): Promise<boolean> {
    this.setAlertLoading(alertId, true);

    try {
      const updated = await this.updateAlertUseCase.execute(alertId, params);
      runInAction(() => {
        this.alerts = this.alerts.map(a =>
          a.id === alertId ? createAlertModel(updated) : a
        );
      });
      return true;
    } catch (err) {
      runInAction(() => {
        this.error = getErrorMessage(err);
      });
      return false;
    } finally {
      this.setAlertLoading(alertId, false);
    }
  }

  async toggleAlert(alertId: string): Promise<void> {
    const alert = this.alerts.find(a => a.id === alertId);
    if (!alert) return;

    const newStatus = alert.isActive ? 'paused' : 'active';
    await this.updateAlert(alertId, { status: newStatus });
  }

  async deleteAlert(alertId: string, hardDelete: boolean = false): Promise<boolean> {
    this.setAlertDeleting(alertId, true);

    try {
      await this.deleteAlertUseCase.execute(alertId, hardDelete);
      runInAction(() => {
        if (hardDelete) {
          this.alerts = this.alerts.filter(a => a.id !== alertId);
        } else {
          this.alerts = this.alerts.map(a =>
            a.id === alertId ? { ...a, status: 'deleted' as const, isDeleted: true } : a
          );
        }
      });
      return true;
    } catch (err) {
      runInAction(() => {
        this.error = getErrorMessage(err);
      });
      return false;
    } finally {
      this.setAlertDeleting(alertId, false);
    }
  }

  setIncludeDeleted(include: boolean): void {
    this.includeDeleted = include;
    this.loadAlerts();
  }

  toggleAlertExpanded(alertId: string): void {
    this.alerts = this.alerts.map(a =>
      a.id === alertId ? { ...a, isExpanded: !a.isExpanded } : a
    );
  }

  private setAlertLoading(alertId: string, loading: boolean): void {
    this.alerts = this.alerts.map(a =>
      a.id === alertId ? { ...a, isLoading: loading } : a
    );
  }

  private setAlertDeleting(alertId: string, deleting: boolean): void {
    this.alerts = this.alerts.map(a =>
      a.id === alertId ? { ...a, isDeleting: deleting } : a
    );
  }

  clearError(): void {
    this.error = null;
  }

  reset(): void {
    this._loadRequestId += 1;
    this.alerts = [];
    this.error = null;
    this.includeDeleted = false;
    this.isLoading = false;
    this.isCreating = false;
  }
}
