import React from 'react';
import { View, Switch } from 'react-native';
import { Bell, CheckCircle2 } from 'lucide-react-native';
import { Typography } from '../../common/Typography';
import { colors } from '../../../theme/tokens';

interface StepConfirmationProps {
  name: string;
  selectedCount: number;
  pushEnabled: boolean;
  onPushEnabledChange: (value: boolean) => void;
}

export function StepConfirmation({ name, selectedCount, pushEnabled, onPushEnabledChange }: StepConfirmationProps) {
  return (
    <View className="pb-10">
      <View className="mb-6 rounded-[28px] border px-5 py-5" style={{ backgroundColor: '#101A2B', borderColor: '#203047' }}>
        <View className="mb-3 flex-row items-center gap-3">
          <View className="h-11 w-11 items-center justify-center rounded-2xl" style={{ backgroundColor: colors.brand.primary }}>
            <CheckCircle2 size={18} color={colors.white} strokeWidth={2.4} />
          </View>
          <View className="flex-1">
            <Typography variant="body" weight="bold" className="text-text-primary">
              Revisa antes de crear
            </Typography>
            <Typography variant="caption" color="secondary" className="mt-1">
              Confirma las condiciones y si quieres recibir notificaciones push.
            </Typography>
          </View>
        </View>
      </View>

      <View className="mb-6 flex-row items-center justify-between rounded-[24px] border p-5" style={{ backgroundColor: colors.bg.modalCard, borderColor: colors.border.medium }}>
        <View className="flex-row items-center gap-4 flex-1">
          <View className="h-12 w-12 items-center justify-center rounded-[18px]" style={{ backgroundColor: colors.brand.primary }}>
            <Bell size={20} color={colors.white} strokeWidth={2} />
          </View>
          <View>
            <Typography variant="body" weight="bold">
              Notificaciones Push
            </Typography>
            <Typography variant="caption" color="muted" className="mt-1">
              Recibir alertas en pantalla
            </Typography>
          </View>
        </View>
        <Switch
          value={pushEnabled}
          onValueChange={onPushEnabledChange}
          trackColor={{ false: colors.border.medium, true: colors.brand.primary }}
          thumbColor={colors.white}
        />
      </View>

      <View className="rounded-[24px] border p-6" style={{ backgroundColor: colors.bg.modalCard, borderColor: colors.border.medium }}>
        <Typography variant="h3" weight="bold" className="mb-6">
          Resumen de alerta
        </Typography>
        <View className="flex-row justify-between border-b py-3" style={{ borderBottomColor: colors.border.medium }}>
          <Typography variant="body" color="secondary">
            Nombre
          </Typography>
          <Typography variant="body" weight="bold">
            {name}
          </Typography>
        </View>
        <View className="flex-row justify-between border-b py-3" style={{ borderBottomColor: colors.border.medium }}>
          <Typography variant="body" color="secondary">
            Condiciones
          </Typography>
          <Typography variant="body" weight="bold">
            {selectedCount} seleccionadas
          </Typography>
        </View>
        <View className="flex-row justify-between pt-3">
          <Typography variant="body" color="secondary">
            Estado Push
          </Typography>
          {pushEnabled ? (
            <Typography variant="body" weight="bold" style={{ color: colors.semantic.successLight }}>
              Activado
            </Typography>
          ) : (
            <Typography variant="body" weight="bold" style={{ color: colors.semantic.dangerLight }}>
              Desactivado
            </Typography>
          )}
        </View>
      </View>
    </View>
  );
}
