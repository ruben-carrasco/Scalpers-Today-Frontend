import { injectable } from 'inversify';
import { buildApiUrl } from '../../config/api.config';

@injectable()
export class ApiEndpointProvider {
  private readonly baseUrl = buildApiUrl();

  getBaseUrl(): string {
    return this.baseUrl;
  }

  get login(): string {
    return `${this.baseUrl}/auth/login`;
  }

  get passwordResetRequest(): string {
    return `${this.baseUrl}/auth/password-reset/request`;
  }

  get passwordResetConfirm(): string {
    return `${this.baseUrl}/auth/password-reset/confirm`;
  }

  get googleLogin(): string {
    return `${this.baseUrl}/auth/google`;
  }

  get register(): string {
    return `${this.baseUrl}/auth/register`;
  }

  get me(): string {
    return `${this.baseUrl}/auth/me`;
  }

  get macro(): string {
    return `${this.baseUrl}/macro`;
  }

  get brief(): string {
    return `${this.baseUrl}/brief`;
  }

  get homeSummary(): string {
    return `${this.baseUrl}/home/summary`;
  }

  get eventsFiltered(): string {
    return `${this.baseUrl}/events/filtered`;
  }

  get eventsWeek(): string {
    return `${this.baseUrl}/events/week`;
  }

  eventsByImportance(importance: number): string {
    return `${this.baseUrl}/events/by-importance/${importance}`;
  }

  get eventsUpcoming(): string {
    return `${this.baseUrl}/events/upcoming`;
  }

  get alerts(): string {
    return `${this.baseUrl}/alerts/`;
  }

  alert(alertId: string): string {
    return `${this.baseUrl}/alerts/${alertId}`;
  }

  get deviceToken(): string {
    return `${this.baseUrl}/alerts/device-token`;
  }

  get deviceTokens(): string {
    return `${this.baseUrl}/alerts/device-tokens`;
  }

  get countries(): string {
    return `${this.baseUrl}/config/countries`;
  }

  get assistantChat(): string {
    return `${this.baseUrl}/assistant/chat`;
  }

  get health(): string {
    return `${this.baseUrl}/health`;
  }
}
