import React from 'react';
import { View, TextInput } from 'react-native';
import { Type, PenLine } from 'lucide-react-native';
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
      <Typography variant="label" color="secondary" className="mb-2 mt-4">Nombre de la alerta</Typography>
      <View className="flex-row items-center rounded-2xl px-4 h-14 border" style={{ backgroundColor: colors.bg.modalCard, borderColor: colors.border.medium }}>
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

      <Typography variant="label" color="secondary" className="mb-2 mt-6">Descripción (Opcional)</Typography>
      <View className="flex-row items-start rounded-2xl p-4 border min-h-[100px]" style={{ backgroundColor: colors.bg.modalCard, borderColor: colors.border.medium }}>
        <PenLine size={18} color={colors.text.icon} strokeWidth={2} className="mt-1" />
        <TextInput
          className="flex-1 ml-3 text-[17px] text-text-primary"
          placeholder="Notas adicionales..."
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
