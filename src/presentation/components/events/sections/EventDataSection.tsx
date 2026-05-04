import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import { ExternalLink } from 'lucide-react-native';
import { EventModel } from '../../../models/EventModel';
import { Typography } from '../../common/Typography';
import { colors } from '../../../theme/tokens';
import { formatEventValue, hasEventValue } from '../../../utils/eventValues';
import { useThemeMode } from '../../../theme/ThemeModeContext';

interface EventDataSectionProps {
  event: EventModel;
}

export function EventDataSection({ event }: EventDataSectionProps) {
  const { isDarkMode } = useThemeMode();
  const surface = isDarkMode ? colors.bg.modalCard : '#F4F4F5';
  const border = isDarkMode ? colors.border.medium : '#CBD5E1';
  const valueDefault = isDarkMode ? colors.text.primary : '#0F172A';

  return (
    <>
      <View className="flex-row rounded-2xl mb-8 p-1" style={{ backgroundColor: surface }}>
        <DataCell label="Actual" value={event.actual} highlight valueDefault={valueDefault} />
        <DataCell label="Previsto" value={event.forecast} valueDefault={valueDefault} />
        <DataCell label="Anterior" value={event.previous} valueDefault={valueDefault} />
      </View>

      {event.url && (
        <TouchableOpacity
          className="flex-row items-center justify-center gap-2 py-4 rounded-xl border mb-8"
          style={{ borderColor: border, backgroundColor: surface }}
          onPress={() => WebBrowser.openBrowserAsync(event.url!)}
          activeOpacity={0.7}
        >
          <ExternalLink size={18} color={colors.brand.primaryLight} strokeWidth={2} />
          <Typography variant="body" weight="bold" style={{ color: colors.brand.primaryLight }}>Ver fuente original</Typography>
        </TouchableOpacity>
      )}
    </>
  );
}

function DataCell({
  label,
  value,
  highlight,
  valueDefault,
}: {
  label: string;
  value: string | null;
  highlight?: boolean;
  valueDefault: string;
}) {
  const hasVal = hasEventValue(value);
  return (
    <View className="flex-1 items-center py-4 rounded-xl" style={highlight && hasVal ? { backgroundColor: colors.brand.primary + '20', borderColor: colors.brand.primary + '30', borderWidth: 1 } : undefined}>
      <Typography variant="caption" color="muted" weight="bold" className="uppercase tracking-widest mb-1 text-[11px]">
        {label}
      </Typography>
      <Typography variant="h2" weight="bold" className="font-mono" style={{ color: highlight && hasVal ? colors.brand.primaryLight : valueDefault }}>
        {formatEventValue(value)}
      </Typography>
    </View>
  );
}
