
import { TYPES } from '../../core/types';
import { AlertsViewModel } from '../viewmodels/AlertsViewModel';
import { useViewModel } from './useViewModel';

export function useAlertsViewModel(): AlertsViewModel {
  return useViewModel<AlertsViewModel>(TYPES.AlertsViewModel);
}
