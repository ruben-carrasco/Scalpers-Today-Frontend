import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Bell, BellOff, AlertCircle, Flag, Banknote, FileText, TrendingUp, Tag, Zap, Clock, Trash2 } from 'lucide-react-native';
import { AlertModel } from '../../models/AlertModel';
import { Typography } from '../common/Typography';
import { colors } from '../../theme/tokens';
import type { LucideIcon } from 'lucide-react-native';

const ALERT_TYPES: { type: string; label: string; Icon: LucideIcon }[] = [
  { type: 'high_impact_event', label: 'Alto Impacto', Icon: AlertCircle },
  { type: 'specific_country', label: 'País', Icon: Flag },
  { type: 'specific_currency', label: 'Moneda', Icon: Banknote },
  { type: 'data_release', label: 'Datos', Icon: FileText },
  { type: 'surprise_move', label: 'Sorpresa', Icon: TrendingUp },
];

interface AlertCardProps {
  alert: AlertModel;
  onToggle: () => void;
  onDelete: () => void;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'active': return colors.semantic.successLight;
    case 'paused': return colors.semantic.warningLight;
    default: return colors.semantic.dangerLight;
  }
};

const getStatusLabel = (status: string) => {
  switch (status) {
    case 'active': return 'Activa';
    case 'paused': return 'Pausada';
    default: return 'Inactiva';
  }
};

export const AlertCard = React.memo(function AlertCard({ alert, onToggle, onDelete }: AlertCardProps) {
  const statusColor = getStatusColor(alert.status);

  return (
    <View
      className="mb-3 overflow-hidden rounded-[30px] border p-5"
      style={{ backgroundColor: colors.bg.modal, borderColor: colors.bg.modalCard }}
      accessibilityLabel={`Alerta ${alert.name}, estado ${getStatusLabel(alert.status)}`}
    >
      <View className="mb-4 flex-row items-start justify-between">
        <View className="mr-4 flex-1">
          <View className="mb-3 flex-row items-center gap-2">
            <View className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: statusColor }} />
            <Typography variant="caption" color="muted" weight="bold" className="uppercase tracking-[0.22em]">
              Regla automatizada
            </Typography>
          </View>

          <Typography
            variant="h3"
            weight="bold"
            className="mb-3"
            style={{ color: colors.text.bright }}
            numberOfLines={1}
          >
            {alert.name}
          </Typography>

          <View className="flex-row items-center gap-2">
            <View className="rounded-full px-3 py-1.5" style={{ backgroundColor: statusColor + '20' }}>
              <Typography
                variant="caption"
                weight="bold"
                style={{ color: statusColor }}
                className="text-[11px] uppercase tracking-[0.2em]"
              >
                {getStatusLabel(alert.status)}
              </Typography>
            </View>

            {alert.triggerCount > 0 && (
              <View className="ml-1 flex-row items-center gap-1.5 rounded-full px-3 py-1.5" style={{ backgroundColor: colors.bg.modalCard }}>
                <Zap size={14} color={colors.semantic.warningLight} strokeWidth={2.5} />
                <Typography variant="caption" color="muted" weight="bold">
                  {alert.triggerCount} disparos
                </Typography>
              </View>
            )}
          </View>
        </View>

        <TouchableOpacity
          className="rounded-[20px]"
          onPress={onToggle}
          disabled={alert.isLoading}
          accessibilityRole="button"
          accessibilityLabel={alert.isActive ? 'Pausar alerta' : 'Activar alerta'}
        >
          {alert.isActive ? (
            <View
              className="h-14 w-14 items-center justify-center rounded-[20px]"
              style={{ backgroundColor: colors.semantic.successLight }}
            >
              <Bell size={20} color={colors.black} strokeWidth={2.5} />
            </View>
          ) : (
            <View
              className="h-14 w-14 items-center justify-center rounded-[20px]"
              style={{ backgroundColor: colors.bg.modalCard }}
            >
              <BellOff size={20} color={colors.text.muted} strokeWidth={2.5} />
            </View>
          )}
        </TouchableOpacity>
      </View>

      {alert.description && (
        <Typography variant="body" color="muted" className="mb-5 leading-relaxed" numberOfLines={2}>
          {alert.description}
        </Typography>
      )}

      <View className="mb-5 flex-row flex-wrap gap-2">
        {alert.conditions.map((condition, index) => {
          const alertType = ALERT_TYPES.find((t) => t.type === condition.alertType);
          const CondIcon = alertType?.Icon || Tag;
          return (
            <View
              key={index}
              className="flex-row items-center gap-2 rounded-2xl px-3 py-2"
              style={{ backgroundColor: colors.bg.modalCard }}
            >
              <CondIcon size={14} color={colors.text.light} strokeWidth={2} />
              <Typography variant="caption" weight="semibold" style={{ color: colors.text.light }}>
                {alertType?.label || condition.alertType}
                {condition.value && `: ${condition.value}`}
              </Typography>
            </View>
          );
        })}
      </View>

      <View className="border-t pt-4" style={{ borderTopColor: colors.bg.modalCard }}>
        <View className="flex-row items-center justify-between">
          {alert.lastTriggeredAt ? (
            <View className="flex-row items-center gap-2">
              <Clock size={14} color={colors.text.muted} strokeWidth={2} />
              <Typography variant="caption" color="muted" weight="semibold">
                Último disparo: {new Date(alert.lastTriggeredAt).toLocaleDateString('es-ES')}
              </Typography>
            </View>
          ) : (
            <Typography variant="caption" color="muted" weight="medium">
              Sin disparos registrados
            </Typography>
          )}

          <TouchableOpacity
            onPress={onDelete}
            disabled={alert.isDeleting}
            className="rounded-full p-2.5"
            style={{ backgroundColor: colors.semantic.dangerLight + '1A' }}
            accessibilityRole="button"
            accessibilityLabel="Eliminar alerta"
          >
            <Trash2 size={18} color={colors.semantic.dangerLight} strokeWidth={2.5} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
});
