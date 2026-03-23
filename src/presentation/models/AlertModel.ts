
import { Alert } from '../../domain/entities/Alert';
import { AlertStatus } from '../../domain/entities/AlertStatus';

export interface AlertModel extends Alert {
  isExpanded: boolean;
  isLoading: boolean;
  isDeleting: boolean;
  statusLabel: string;
  statusColor: string;
  isActive: boolean;
  isPaused: boolean;
  isDeleted: boolean;
}

export function createAlertModel(alert: Alert): AlertModel {
  const statusLabels: Record<AlertStatus, string> = {
    active: 'Activa',
    paused: 'Pausada',
    deleted: 'Eliminada',
  };

  const statusColors: Record<AlertStatus, string> = {
    active: '#10B981',
    paused: '#F59E0B',
    deleted: '#EF4444',
  };

  return {
    ...alert,
    isExpanded: false,
    isLoading: false,
    isDeleting: false,
    statusLabel: statusLabels[alert.status],
    statusColor: statusColors[alert.status],
    isActive: alert.status === 'active',
    isPaused: alert.status === 'paused',
    isDeleted: alert.status === 'deleted',
  };
}
