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
    <View className="rounded-3xl p-5 border mb-3" style={{ backgroundColor: colors.bg.modal, borderColor: colors.bg.modalCard }} accessibilityLabel={`Alerta ${alert.name}, estado ${getStatusLabel(alert.status)}`}>
      <View className="flex-row justify-between items-start mb-4">
        <View className="flex-1 mr-4">
          <Typography variant="h3" weight="bold" className="mb-2" style={{ color: colors.text.bright }} numberOfLines={1}>
            {alert.name}
          </Typography>
          <View className="flex-row items-center gap-2">
            <View className="px-2 py-1 rounded-md" style={{ backgroundColor: statusColor + '20' }}>
              <Typography variant="caption" weight="bold" style={{ color: statusColor }} className="uppercase tracking-widest text-[11px]">
                {getStatusLabel(alert.status)}
              </Typography>
            </View>
            {alert.triggerCount > 0 && (
              <View className="flex-row items-center gap-1 ml-2">
                <Zap size={14} color={colors.semantic.warningLight} strokeWidth={2.5} />
                <Typography variant="caption" color="muted" weight="bold">
                  {alert.triggerCount}
                </Typography>
              </View>
            )}
          </View>
        </View>
        <TouchableOpacity
          className="rounded-full"
          onPress={onToggle}
          disabled={alert.isLoading}
          accessibilityRole="button"
          accessibilityLabel={alert.isActive ? 'Pausar alerta' : 'Activar alerta'}
        >
          {alert.isActive ? (
            <View className="w-12 h-12 rounded-full items-center justify-center" style={{ backgroundColor: colors.semantic.successLight }}>
              <Bell size={20} color={colors.black} strokeWidth={2.5} />
            </View>
          ) : (
            <View className="w-12 h-12 rounded-full items-center justify-center" style={{ backgroundColor: colors.bg.modalCard }}>
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

      <View className="flex-row flex-wrap gap-2 mb-5">
        {alert.conditions.map((condition, index) => {
          const alertType = ALERT_TYPES.find((t) => t.type === condition.alertType);
          const CondIcon = alertType?.Icon || Tag;
          return (
            <View key={index} className="flex-row items-center px-3 py-1.5 rounded-lg gap-2" style={{ backgroundColor: colors.bg.modalCard }}>
              <CondIcon size={14} color={colors.text.light} strokeWidth={2} />
              <Typography variant="caption" weight="semibold" style={{ color: colors.text.light }}>
                {alertType?.label || condition.alertType}
                {condition.value && `: ${condition.value}`}
              </Typography>
            </View>
          );
        })}
      </View>

      <View className="flex-row items-center justify-between pt-4 border-t" style={{ borderTopColor: colors.bg.modalCard }}>
        {alert.lastTriggeredAt ? (
          <View className="flex-row items-center gap-2">
            <Clock size={14} color={colors.text.muted} strokeWidth={2} />
            <Typography variant="caption" color="muted" weight="semibold">
              Último: {new Date(alert.lastTriggeredAt).toLocaleDateString('es-ES')}
            </Typography>
          </View>
        ) : (
          <Typography variant="caption" color="muted" weight="medium">Nunca disparada</Typography>
        )}
        <TouchableOpacity
          onPress={onDelete}
          disabled={alert.isDeleting}
          className="p-2 rounded-full"
          style={{ backgroundColor: colors.semantic.dangerLight + '1A' }}
          accessibilityRole="button"
          accessibilityLabel="Eliminar alerta"
        >
          <Trash2 size={18} color={colors.semantic.dangerLight} strokeWidth={2.5} />
        </TouchableOpacity>
      </View>
    </View>
  );
});
