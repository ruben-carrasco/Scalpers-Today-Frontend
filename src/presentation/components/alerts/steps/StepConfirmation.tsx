import React from 'react';
import { View, Switch } from 'react-native';
import { Bell } from 'lucide-react-native';
import { Typography } from '../../common/Typography';
import { colors } from '../../../theme/tokens';

interface StepConfirmationProps {
  name: string;
  selectedCount: number;
  pushEnabled: boolean;
  onPushEnabledChange: (value: boolean) => void;
  isDarkMode: boolean;
}

export function StepConfirmation({ name, selectedCount, pushEnabled, onPushEnabledChange, isDarkMode }: StepConfirmationProps) {
  const surface = isDarkMode ? colors.bg.modalCard : '#FFFFFF';
  const border = isDarkMode ? colors.border.medium : '#CBD5E1';

  return (
    <View className="pb-10">
      <View className="flex-row items-center justify-between p-5 rounded-2xl mb-6 border" style={{ backgroundColor: surface, borderColor: border }}>
        <View className="flex-row items-center gap-4 flex-1">
          <View className="w-12 h-12 rounded-xl items-center justify-center" style={{ backgroundColor: colors.brand.primary }}>
            <Bell size={20} color={colors.white} strokeWidth={2} />
          </View>
          <View>
            <Typography variant="body" weight="bold">Notificaciones Push</Typography>
            <Typography variant="caption" color="muted" className="mt-1">Recibir alertas en pantalla</Typography>
          </View>
        </View>
        <Switch
          value={pushEnabled}
          onValueChange={onPushEnabledChange}
          trackColor={{ false: colors.border.medium, true: colors.brand.primary }}
          thumbColor={colors.white}
        />
      </View>

      <View className="rounded-2xl p-6 border" style={{ backgroundColor: surface, borderColor: border }}>
        <Typography variant="h3" weight="bold" className="mb-6">Resumen de Alerta</Typography>
        <View className="flex-row justify-between py-3 border-b" style={{ borderBottomColor: border }}>
          <Typography variant="body" color="secondary">Nombre</Typography>
          <Typography variant="body" weight="bold">{name}</Typography>
        </View>
        <View className="flex-row justify-between py-3 border-b" style={{ borderBottomColor: border }}>
          <Typography variant="body" color="secondary">Condiciones</Typography>
          <Typography variant="body" weight="bold">{selectedCount} seleccionadas</Typography>
        </View>
        <View className="flex-row justify-between pt-3">
          <Typography variant="body" color="secondary">Estado Push</Typography>
          {pushEnabled ? (
            <Typography variant="body" weight="bold" style={{ color: colors.semantic.successLight }}>Activado</Typography>
          ) : (
            <Typography variant="body" weight="bold" style={{ color: colors.semantic.dangerLight }}>Desactivado</Typography>
          )}
        </View>
      </View>
    </View>
  );
}
