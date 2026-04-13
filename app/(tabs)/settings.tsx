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
import { ShieldCheck, Mail, Info, ChevronRight, LogOut } from 'lucide-react-native';
import { observer } from 'mobx-react-lite';
import { useAuthViewModel } from '../../src/presentation/hooks';
import { Typography } from '../../src/presentation/components/common/Typography';

export default observer(function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const authViewModel = useAuthViewModel();
  const user = authViewModel.user;

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
    <View className="flex-1 bg-black">
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View style={{ paddingTop: insets.top + 20 }} className="px-6 pb-4 bg-black">
        <Typography variant="h1" weight="bold" className="text-white">Ajustes</Typography>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Profile */}
        <View className="px-6 mt-4">
          <View className="bg-[#18181B] rounded-3xl p-6 flex-row items-center border border-[#27272A]">
            <View className="w-16 h-16 rounded-full bg-[#3B82F6] items-center justify-center">
              <Typography variant="h2" weight="bold" className="text-white">
                {user?.name?.charAt(0).toUpperCase() || '?'}
              </Typography>
            </View>
            <View className="ml-5 flex-1">
              <Typography variant="h2" weight="bold" className="mb-1 text-white">{user?.name || 'Usuario'}</Typography>
              <Typography variant="body" color="muted" weight="medium">{user?.email || 'email@ejemplo.com'}</Typography>
              {user?.isVerified && (
                <View className="flex-row items-center mt-3 gap-1.5">
                  <ShieldCheck size={16} color="#34D399" strokeWidth={2.5} />
                  <Typography variant="caption" weight="bold" className="text-[#34D399] uppercase tracking-widest">
                    Verificado
                  </Typography>
                </View>
              )}
            </View>
          </View>
        </View>

        {/* Support Section */}
        <View className="px-6 mt-8">
          <Typography variant="caption" color="muted" weight="bold" className="uppercase tracking-widest ml-2 mb-3">
            Soporte
          </Typography>
          <View className="bg-[#18181B] rounded-3xl overflow-hidden border border-[#27272A]">
            <TouchableOpacity
              className="flex-row items-center p-5"
              onPress={() => Linking.openURL('mailto:soporte@scalpertoday.com')}
              activeOpacity={0.7}
            >
              <View className="w-10 h-10 rounded-full bg-[#27272A] justify-center items-center mr-4">
                <Mail size={18} color="#E4E4E7" strokeWidth={2} />
              </View>
              <View className="flex-1">
                <Typography variant="body" weight="semibold" className="text-white">Contactar Soporte</Typography>
              </View>
              <ChevronRight size={20} color="#52525B" strokeWidth={2} />
            </TouchableOpacity>

            <View className="h-px bg-[#27272A] mx-5" />

            <TouchableOpacity
              className="flex-row items-center p-5"
              onPress={() => Alert.alert('Acerca de', 'Scalper Today v1.0.0\n\nAplicación de alertas para eventos económicos.\n\nDiseñada para traders que quieren estar informados de los eventos macro más importantes.')}
              activeOpacity={0.7}
            >
              <View className="w-10 h-10 rounded-full bg-[#27272A] justify-center items-center mr-4">
                <Info size={18} color="#E4E4E7" strokeWidth={2} />
              </View>
              <View className="flex-1">
                <Typography variant="body" weight="semibold" className="text-white">Acerca de la App</Typography>
              </View>
              <ChevronRight size={20} color="#52525B" strokeWidth={2} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Account Section */}
        <View className="px-6 mt-8">
          <Typography variant="caption" color="muted" weight="bold" className="uppercase tracking-widest ml-2 mb-3">
            Cuenta
          </Typography>
          <View className="bg-[#18181B] rounded-3xl overflow-hidden border border-[#27272A]">
            <TouchableOpacity
              className="flex-row items-center p-5"
              onPress={handleLogout}
              activeOpacity={0.7}
            >
              <View className="w-10 h-10 rounded-full bg-[#FF453A]/10 justify-center items-center mr-4">
                <LogOut size={18} color="#FF453A" strokeWidth={2.5} />
              </View>
              <View className="flex-1">
                <Typography variant="body" weight="bold" className="text-[#FF453A]">Cerrar Sesión</Typography>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Footer */}
        <View style={{ paddingBottom: insets.bottom + 120 }} className="items-center mt-12 px-6">
          <View className="w-14 h-14 rounded-2xl bg-[#18181B] justify-center items-center mb-4 overflow-hidden border border-[#27272A]">
            <Image 
              source={require('../../assets/icon.png')} 
              style={{ width: '100%', height: '100%' }}
              resizeMode="contain"
            />
          </View>
          <Typography variant="h3" weight="bold" className="text-[#A1A1AA] mb-2">Scalper Today</Typography>
          <Typography variant="body" color="muted" weight="medium">Versión 1.0.0</Typography>
        </View>
      </ScrollView>
    </View>
  );
});
