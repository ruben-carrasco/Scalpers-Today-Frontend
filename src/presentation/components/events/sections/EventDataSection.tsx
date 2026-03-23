import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import { ExternalLink } from 'lucide-react-native';
import { EventModel } from '../../../models/EventModel';
import { Typography } from '../../common/Typography';
import { colors } from '../../../theme/tokens';

interface EventDataSectionProps {
  event: EventModel;
}

export function EventDataSection({ event }: EventDataSectionProps) {
  return (
    <>
      <View className="flex-row rounded-2xl mb-8 p-1" style={{ backgroundColor: colors.bg.modalCard }}>
        <DataCell label="Actual" value={event.actual} highlight />
        <DataCell label="Previsto" value={event.forecast} />
        <DataCell label="Anterior" value={event.previous} />
      </View>

      {event.url && (
        <TouchableOpacity
          className="flex-row items-center justify-center gap-2 py-4 rounded-xl border mb-8"
          style={{ borderColor: colors.border.medium, backgroundColor: colors.bg.modalCard }}
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

function DataCell({ label, value, highlight }: { label: string; value: string | null; highlight?: boolean }) {
  const hasVal = !!value;
  return (
    <View className="flex-1 items-center py-4 rounded-xl" style={highlight && hasVal ? { backgroundColor: colors.brand.primary + '20', borderColor: colors.brand.primary + '30', borderWidth: 1 } : undefined}>
      <Typography variant="caption" color="muted" weight="bold" className="uppercase tracking-widest mb-1 text-[11px]">
        {label}
      </Typography>
      <Typography variant="h2" weight="bold" className="font-mono" style={{ color: highlight && hasVal ? colors.brand.primaryLight : colors.text.primary }}>
        {value || '--'}
      </Typography>
    </View>
  );
}
