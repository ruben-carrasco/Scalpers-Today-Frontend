import {
  View,
  TouchableOpacity,
  ScrollView,
  Alert,
  StatusBar,
  Linking,
  Image,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ShieldCheck, Mail, Info, ChevronRight, LogOut, Moon, Sun } from 'lucide-react-native';
import { observer } from 'mobx-react-lite';
import { useAuthViewModel } from '../../src/presentation/hooks';
import { Typography } from '../../src/presentation/components/common/Typography';
import { useThemeMode } from '../../src/presentation/theme/ThemeModeContext';

export default observer(function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const authViewModel = useAuthViewModel();
  const user = authViewModel.user;
  const { themeMode, isDarkMode, setThemeMode } = useThemeMode();

  const palette = isDarkMode
    ? {
        screenBg: '#000000',
        sectionBg: '#18181B',
        sectionBorder: '#27272A',
        textPrimary: '#FFFFFF',
        textMuted: '#A1A1AA',
        iconBg: '#27272A',
        iconColor: '#E4E4E7',
        chevron: '#52525B',
        divider: '#27272A',
        verified: '#34D399',
        themeInactiveBg: '#27272A',
        themeInactiveText: '#A1A1AA',
      }
    : {
        screenBg: '#F4F4F5',
        sectionBg: '#FFFFFF',
        sectionBorder: '#E4E4E7',
        textPrimary: '#18181B',
        textMuted: '#52525B',
        iconBg: '#F4F4F5',
        iconColor: '#18181B',
        chevron: '#71717A',
        divider: '#E4E4E7',
        verified: '#059669',
        themeInactiveBg: '#F4F4F5',
        themeInactiveText: '#52525B',
      };

  const handleLogout = () => {
    Alert.alert(
      'Cerrar sesión',
      '¿Estás seguro de que deseas cerrar sesión?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Cerrar sesión',
          style: 'destructive',
          onPress: async () => {
            await authViewModel.logout();
            router.replace('/(auth)/login');
          },
        },
      ]
    );
  };

  return (
    <View className="flex-1" style={{ backgroundColor: palette.screenBg }}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />

      {/* Header */}
      <View style={{ paddingTop: insets.top + 20, backgroundColor: palette.screenBg }} className="px-6 pb-4">
        <Typography variant="h1" weight="bold" style={{ color: palette.textPrimary }}>Ajustes</Typography>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Profile */}
        <View className="px-6 mt-4">
          <View
            className="rounded-3xl p-6 flex-row items-center border"
            style={{ backgroundColor: palette.sectionBg, borderColor: palette.sectionBorder }}
          >
            <View className="w-16 h-16 rounded-full bg-[#3B82F6] items-center justify-center">
              <Typography variant="h2" weight="bold" className="text-white">
                {user?.name?.charAt(0).toUpperCase() || '?'}
              </Typography>
            </View>
            <View className="ml-5 flex-1">
              <Typography variant="h2" weight="bold" className="mb-1" style={{ color: palette.textPrimary }}>{user?.name || 'Usuario'}</Typography>
              <Typography variant="body" weight="medium" style={{ color: palette.textMuted }}>{user?.email || 'email@ejemplo.com'}</Typography>
              {user?.isVerified && (
                <View className="flex-row items-center mt-3 gap-1.5">
                  <ShieldCheck size={16} color={palette.verified} strokeWidth={2.5} />
                  <Typography variant="caption" weight="bold" className="uppercase tracking-widest" style={{ color: palette.verified }}>
                    Verificado
                  </Typography>
                </View>
              )}
            </View>
          </View>
        </View>

        {/* Appearance Section */}
        <View className="px-6 mt-8">
          <Typography variant="caption" color="muted" weight="bold" className="uppercase tracking-widest ml-2 mb-3">
            Apariencia
          </Typography>
          <View
            className="rounded-3xl p-4 border"
            style={{ backgroundColor: palette.sectionBg, borderColor: palette.sectionBorder }}
          >
            <View className="flex-row items-center justify-between gap-3">
              <View className="flex-row items-center gap-3">
                <View
                  className="w-10 h-10 rounded-full items-center justify-center"
                  style={{ backgroundColor: palette.iconBg }}
                >
                  {isDarkMode ? (
                    <Moon size={18} color={palette.iconColor} strokeWidth={2} />
                  ) : (
                    <Sun size={18} color={palette.iconColor} strokeWidth={2} />
                  )}
                </View>
                <View>
                  <Typography variant="body" weight="semibold" style={{ color: palette.textPrimary }}>
                    Modo de color
                  </Typography>
                  <Typography variant="caption" weight="medium" style={{ color: palette.textMuted }}>
                    {isDarkMode ? 'Oscuro' : 'Claro'}
                  </Typography>
                </View>
              </View>

              <View className="flex-row items-center rounded-full p-1" style={{ backgroundColor: palette.themeInactiveBg }}>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => setThemeMode('dark')}
                  className={`px-3 py-2 rounded-full ${themeMode === 'dark' ? 'bg-[#3B82F6]' : ''}`}
                >
                  <Typography
                    variant="caption"
                    weight="bold"
                    style={{ color: themeMode === 'dark' ? '#FFFFFF' : palette.themeInactiveText }}
                  >
                    Oscuro
                  </Typography>
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => setThemeMode('light')}
                  className={`px-3 py-2 rounded-full ${themeMode === 'light' ? 'bg-[#3B82F6]' : ''}`}
                >
                  <Typography
                    variant="caption"
                    weight="bold"
                    style={{ color: themeMode === 'light' ? '#FFFFFF' : palette.themeInactiveText }}
                  >
                    Claro
                  </Typography>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>

        {/* Support Section */}
        <View className="px-6 mt-8">
          <Typography variant="caption" color="muted" weight="bold" className="uppercase tracking-widest ml-2 mb-3">
            Soporte
          </Typography>
          <View
            className="rounded-3xl overflow-hidden border"
            style={{ backgroundColor: palette.sectionBg, borderColor: palette.sectionBorder }}
          >
            <TouchableOpacity
              className="flex-row items-center p-5"
              onPress={() => Linking.openURL('mailto:soporte@scalpertoday.com')}
              activeOpacity={0.7}
            >
              <View
                className="w-10 h-10 rounded-full justify-center items-center mr-4"
                style={{ backgroundColor: palette.iconBg }}
              >
                <Mail size={18} color={palette.iconColor} strokeWidth={2} />
              </View>
              <View className="flex-1">
                <Typography variant="body" weight="semibold" style={{ color: palette.textPrimary }}>Contactar Soporte</Typography>
              </View>
              <ChevronRight size={20} color={palette.chevron} strokeWidth={2} />
            </TouchableOpacity>

            <View className="h-px mx-5" style={{ backgroundColor: palette.divider }} />

            <TouchableOpacity
              className="flex-row items-center p-5"
              onPress={() => Alert.alert('Acerca de', 'Scalper Today v1.0.0\n\nAplicación de alertas para eventos económicos.\n\nDiseñada para traders que quieren estar informados de los eventos macro más importantes.')}
              activeOpacity={0.7}
            >
              <View
                className="w-10 h-10 rounded-full justify-center items-center mr-4"
                style={{ backgroundColor: palette.iconBg }}
              >
                <Info size={18} color={palette.iconColor} strokeWidth={2} />
              </View>
              <View className="flex-1">
                <Typography variant="body" weight="semibold" style={{ color: palette.textPrimary }}>Acerca de la App</Typography>
              </View>
              <ChevronRight size={20} color={palette.chevron} strokeWidth={2} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Account Section */}
        <View className="px-6 mt-8">
          <Typography variant="caption" color="muted" weight="bold" className="uppercase tracking-widest ml-2 mb-3">
            Cuenta
          </Typography>
          <View
            className="rounded-3xl overflow-hidden border"
            style={{ backgroundColor: palette.sectionBg, borderColor: palette.sectionBorder }}
          >
            <TouchableOpacity
              className="flex-row items-center p-5"
              onPress={handleLogout}
              activeOpacity={0.7}
            >
              <View
                className="w-10 h-10 rounded-full justify-center items-center mr-4"
                style={{ backgroundColor: isDarkMode ? 'rgba(255,69,58,0.10)' : '#FEE2E2' }}
              >
                <LogOut size={18} color={isDarkMode ? '#FF453A' : '#B91C1C'} strokeWidth={2.5} />
              </View>
              <View className="flex-1">
                <Typography
                  variant="body"
                  weight="bold"
                  style={{ color: isDarkMode ? '#FF453A' : '#B91C1C' }}
                >
                  Cerrar Sesión
                </Typography>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Footer */}
        <View style={{ paddingBottom: insets.bottom + 120 }} className="items-center mt-12 px-6">
          <View
            className="w-14 h-14 rounded-2xl justify-center items-center mb-4 overflow-hidden border"
            style={{ backgroundColor: palette.sectionBg, borderColor: palette.sectionBorder }}
          >
            <Image 
              source={require('../../assets/icon.png')} 
              style={{ width: '100%', height: '100%' }}
              resizeMode="contain"
            />
          </View>
          <Typography variant="h3" weight="bold" className="mb-2" style={{ color: palette.textMuted }}>Scalper Today</Typography>
          <Typography variant="body" weight="medium" style={{ color: palette.textMuted }}>Versión 1.0.0</Typography>
        </View>
      </ScrollView>
    </View>
  );
});
