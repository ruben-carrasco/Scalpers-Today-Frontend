export interface IDeleteAlertUseCase {
  execute(alertId: string, hardDelete?: boolean): Promise<void>;
}
