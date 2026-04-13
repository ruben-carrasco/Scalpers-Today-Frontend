import React from 'react';
import { View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Activity, Sparkles } from 'lucide-react-native';
import { Typography } from '../common/Typography';

interface HomeHeaderProps {
  userName: string;
  currentTime: string;
  paddingTop: number;
}

const formatDateShort = (): string => {
  const now = new Date();
  const options: Intl.DateTimeFormatOptions = {
    weekday: 'short',
    day: 'numeric',
    month: 'long',
  };
  const formatted = now.toLocaleDateString('es-ES', options);
  return formatted.charAt(0).toUpperCase() + formatted.slice(1);
};

export function HomeHeader({ userName, currentTime, paddingTop }: HomeHeaderProps) {
  return (
    <View style={{ paddingTop: paddingTop + 16 }} className="px-6 pb-6 bg-bg-primary">
      <LinearGradient
        colors={['#14213D', '#0B1020', '#080D19']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="overflow-hidden rounded-[32px] border border-[#1E293B] px-6 pb-6 pt-5"
      >
        <View className="absolute -right-10 -top-10 h-36 w-36 rounded-full bg-[#2563EB]/20" />
        <View className="absolute -left-6 bottom-0 h-24 w-24 rounded-full bg-[#F59E0B]/10" />

        <View className="mb-5 flex-row items-center justify-between">
          <View className="flex-row items-center gap-2 rounded-full border border-[#334155] bg-[#0F172A]/70 px-3 py-2">
            <Sparkles size={14} color="#FBBF24" strokeWidth={2.5} />
            <Typography variant="caption" weight="bold" className="text-[#E2E8F0]">
              Radar macro activo
            </Typography>
          </View>
          <View className="rounded-full border border-[#334155] bg-[#020617]/70 px-4 py-2">
            <Typography
              variant="body"
              weight="bold"
              className="font-mono tracking-[0.25em] text-text-primary"
            >
              {currentTime}
            </Typography>
          </View>
        </View>

        <View className="mb-6">
          <Typography variant="label" color="secondary" weight="bold" className="mb-3">
            Scalper Today
          </Typography>
          <Typography variant="h1" weight="extrabold" className="mb-2 text-text-primary">
            {userName}
          </Typography>
          <Typography variant="body" color="secondary" weight="medium" className="max-w-[85%]">
            {formatDateShort()} · Sesion europea abierta, foco en volatilidad y eventos de alto impacto.
          </Typography>
        </View>

        <View className="flex-row items-center gap-3 rounded-[24px] border border-[#1E293B] bg-[#020617]/60 px-4 py-4">
          <View className="h-10 w-10 items-center justify-center rounded-2xl bg-[#0F766E]/20">
            <Activity size={20} color="#2DD4BF" strokeWidth={2.5} />
          </View>
          <View className="flex-1">
            <Typography variant="caption" color="secondary" weight="bold" className="mb-1">
              Estado del flujo
            </Typography>
            <Typography variant="body" weight="semibold" className="text-text-primary">
              Datos sincronizados y briefing listo para operar.
            </Typography>
          </View>
        </View>
      </LinearGradient>
    </View>
  );
}
