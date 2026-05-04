import React from 'react';
import { View, TouchableOpacity, ScrollView } from 'react-native';
import { AlertCircle, Flag, Banknote, FileText, TrendingUp, CheckCircle, Circle } from 'lucide-react-native';
import { AlertType } from '../../../../domain/entities/AlertType';
import { Typography } from '../../common/Typography';
import { colors } from '../../../theme/tokens';
import type { LucideIcon } from 'lucide-react-native';

const ALERT_TYPES: { type: AlertType; label: string; description: string; Icon: LucideIcon }[] = [
  { type: 'high_impact_event', label: 'Evento Alto Impacto', description: 'Notificar eventos de alta importancia', Icon: AlertCircle },
  { type: 'specific_country', label: 'País Específico', description: 'Eventos de un país en particular', Icon: Flag },
  { type: 'specific_currency', label: 'Moneda Específica', description: 'Eventos que afectan una moneda', Icon: Banknote },
  { type: 'data_release', label: 'Publicación de Datos', description: 'Cuando se publican datos económicos', Icon: FileText },
  { type: 'surprise_move', label: 'Sorpresa del Mercado', description: 'Datos mejores o peores de lo esperado', Icon: TrendingUp },
];

const AVAILABLE_CURRENCIES = ['USD', 'EUR', 'GBP', 'JPY', 'CHF', 'AUD', 'CAD', 'NZD', 'CNY'];

interface StepConditionsProps {
  selectedTypes: AlertType[];
  conditionValues: Record<AlertType, string>;
  availableCountries: string[];
  onToggleType: (type: AlertType) => void;
  onSetConditionValue: (type: AlertType, value: string) => void;
  isDarkMode: boolean;
}

export function StepConditions({ selectedTypes, conditionValues, availableCountries, onToggleType, onSetConditionValue, isDarkMode }: StepConditionsProps) {
  const baseBg = isDarkMode ? colors.bg.modalCard : '#FFFFFF';
  const baseSurface = isDarkMode ? colors.bg.modal : '#F4F4F5';
  const baseBorder = isDarkMode ? colors.border.medium : '#CBD5E1';
  const baseText = isDarkMode ? colors.text.icon : '#334155';
  const indicator = isDarkMode ? colors.border.indicator : '#64748B';
  const descriptionText = isDarkMode ? colors.text.muted : '#475569';

  return (
    <View className="pb-10">
      {ALERT_TYPES.map((alertType) => {
        const isSelected = selectedTypes.includes(alertType.type);
        return (
          <TouchableOpacity
            key={alertType.type}
            onPress={() => onToggleType(alertType.type)}
            activeOpacity={0.7}
            className="flex-row items-center p-4 rounded-2xl mb-3 border"
            style={{ backgroundColor: isSelected ? colors.brand.primary + '1A' : baseBg, borderColor: isSelected ? colors.brand.primary : baseBorder }}
          >
            <View className="w-12 h-12 rounded-xl items-center justify-center mr-4" style={{ backgroundColor: isSelected ? colors.brand.primary : baseSurface }}>
              <alertType.Icon size={20} color={isSelected ? colors.white : baseText} strokeWidth={2} />
            </View>
            <View className="flex-1">
              <Typography variant="body" weight="bold" style={{ color: isSelected ? colors.text.primary : baseText }}>
                {alertType.label}
              </Typography>
              <Typography variant="caption" className="mt-1" style={{ color: descriptionText }}>
                {alertType.description}
              </Typography>
            </View>
            {isSelected ? (
              <CheckCircle size={24} color={colors.brand.primary} strokeWidth={2.5} />
            ) : (
              <Circle size={24} color={indicator} strokeWidth={2.5} />
            )}
          </TouchableOpacity>
        );
      })}

      {selectedTypes.includes('specific_country') && (
        <ValueSelector
          label="Selecciona un País"
          items={availableCountries}
          selectedValue={conditionValues['specific_country']}
          onSelect={(v) => onSetConditionValue('specific_country', v)}
          isDarkMode={isDarkMode}
        />
      )}

      {selectedTypes.includes('specific_currency') && (
        <ValueSelector
          label="Selecciona una Moneda"
          items={AVAILABLE_CURRENCIES}
          selectedValue={conditionValues['specific_currency']}
          onSelect={(v) => onSetConditionValue('specific_currency', v)}
          isDarkMode={isDarkMode}
        />
      )}
    </View>
  );
}

function ValueSelector({
  label,
  items,
  selectedValue,
  onSelect,
  isDarkMode,
}: {
  label: string;
  items: string[];
  selectedValue?: string;
  onSelect: (v: string) => void;
  isDarkMode: boolean;
}) {
  const boxBg = isDarkMode ? colors.bg.modalCard : '#EEF2FF';
  const chipBg = isDarkMode ? colors.bg.modal : '#FFFFFF';
  const border = isDarkMode ? colors.border.medium : '#CBD5E1';
  const chipText = isDarkMode ? colors.text.icon : '#334155';
  const labelText = isDarkMode ? colors.text.secondary : '#334155';

  return (
    <View className="mt-4 p-4 rounded-2xl" style={{ backgroundColor: boxBg }}>
      <Typography variant="label" className="mb-3" style={{ color: labelText }}>{label}</Typography>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {items.map((item) => {
          const isSelected = selectedValue === item;
          return (
            <TouchableOpacity
              key={item}
              onPress={() => onSelect(item)}
              className="px-4 py-2 rounded-xl mr-2 border"
              style={{ backgroundColor: isSelected ? colors.brand.primary : chipBg, borderColor: isSelected ? colors.brand.primary : border, borderWidth: isSelected ? 0 : 1 }}
            >
              <Typography variant="body" weight="semibold" style={{ color: isSelected ? colors.text.primary : chipText }}>
                {item}
              </Typography>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}
