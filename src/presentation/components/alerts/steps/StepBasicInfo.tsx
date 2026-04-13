import React from 'react';
import { View, TextInput } from 'react-native';
import { Type, PenLine, BellRing } from 'lucide-react-native';
import { Typography } from '../../common/Typography';
import { colors } from '../../../theme/tokens';

interface StepBasicInfoProps {
  name: string;
  description: string;
  onNameChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
}

export function StepBasicInfo({ name, description, onNameChange, onDescriptionChange }: StepBasicInfoProps) {
  return (
    <View className="pb-10">
      <View className="mb-6 rounded-[28px] border px-5 py-5" style={{ backgroundColor: '#0F172A', borderColor: '#203047' }}>
        <View className="mb-3 flex-row items-center gap-3">
          <View className="h-11 w-11 items-center justify-center rounded-2xl" style={{ backgroundColor: colors.brand.primary }}>
            <BellRing size={18} color={colors.white} strokeWidth={2.4} />
          </View>
          <View className="flex-1">
            <Typography variant="body" weight="bold" className="text-text-primary">
              Define la alerta
            </Typography>
            <Typography variant="caption" color="secondary" className="mt-1">
              Ponle un nombre claro para identificarla rápido cuando se active.
            </Typography>
          </View>
        </View>
      </View>

      <Typography variant="label" color="secondary" className="mb-2 mt-4">
        Nombre de la alerta
      </Typography>
      <View
        className="h-14 flex-row items-center rounded-[22px] border px-4"
        style={{ backgroundColor: colors.bg.modalCard, borderColor: colors.border.medium }}
      >
        <Type size={18} color={colors.text.icon} strokeWidth={2} />
        <TextInput
          className="flex-1 ml-3 text-[17px] text-text-primary"
          placeholder="Ej: Alertas NFP USA"
          placeholderTextColor={colors.text.muted}
          value={name}
          onChangeText={onNameChange}
          accessibilityLabel="Nombre de la alerta"
        />
      </View>

      <Typography variant="label" color="secondary" className="mb-2 mt-6">
        Descripción (Opcional)
      </Typography>
      <View
        className="min-h-[120px] flex-row items-start rounded-[22px] border p-4"
        style={{ backgroundColor: colors.bg.modalCard, borderColor: colors.border.medium }}
      >
        <PenLine size={18} color={colors.text.icon} strokeWidth={2} className="mt-1" />
        <TextInput
          className="flex-1 ml-3 text-[17px] text-text-primary"
          placeholder="Añade contexto: sesión, estrategia o criterio de uso..."
          placeholderTextColor={colors.text.muted}
          value={description}
          onChangeText={onDescriptionChange}
          multiline
          accessibilityLabel="Descripción de la alerta"
        />
      </View>
    </View>
  );
}
