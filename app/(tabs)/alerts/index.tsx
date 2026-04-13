import { useEffect, useState } from 'react';
import { View, TouchableOpacity, RefreshControl, Alert, StatusBar } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Plus, BellOff, BellRing, PauseCircle, ShieldAlert } from 'lucide-react-native';
import { observer } from 'mobx-react-lite';
import { useAlertsViewModel, useEventsViewModel, useHaptics } from '../../../src/presentation/hooks';
import { AlertCard, CreateAlertModal } from '../../../src/presentation/components/alerts';
import { AlertCardSkeleton } from '../../../src/presentation/components/alerts/AlertCardSkeleton';
import { AnimatedCard } from '../../../src/presentation/components/common/AnimatedCard';
import { AlertCondition } from '../../../src/domain/entities/AlertCondition';
import { Typography } from '../../../src/presentation/components/common/Typography';

export default observer(function AlertsScreen() {
  const insets = useSafeAreaInsets();
  const [createModalVisible, setCreateModalVisible] = useState(false);

  const alertsViewModel = useAlertsViewModel();
  const eventsViewModel = useEventsViewModel();
  const haptics = useHaptics();

  useEffect(() => {
    alertsViewModel.loadAlerts();
    if (eventsViewModel.availableCountries.length === 0) {
      eventsViewModel.loadEvents();
    }
  }, [alertsViewModel, eventsViewModel]);

  const handleToggleAlert = (alertId: string) => {
    haptics.impactLight();
    alertsViewModel.toggleAlert(alertId);
  };

  const handleDeleteAlert = (alertId: string) => {
    haptics.warning();
    Alert.alert(
      'Eliminar alerta',
      '¿Estás seguro de que deseas eliminar esta alerta?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => alertsViewModel.deleteAlert(alertId, false),
        },
      ]
    );
  };

  const handleCreateAlert = async (name: string, description: string, conditions: AlertCondition[], pushEnabled: boolean) => {
    const success = await alertsViewModel.createAlert({
      name,
      description: description || undefined,
      conditions,
      pushEnabled,
    });

    if (success) {
      haptics.success();
      Alert.alert('Alerta creada', 'Tu alerta ha sido creada exitosamente.');
    }
  };

  const { alerts, isLoading } = alertsViewModel;
  const activeAlerts = alerts.filter(a => a.status === 'active').length;
  const pausedAlerts = alerts.filter(a => a.status === 'paused').length;
  const totalAlerts = alerts.length;

  return (
    <View className="flex-1 bg-bg-primary">
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View style={{ paddingTop: insets.top + 18 }} className="bg-bg-primary px-6 pb-4">
        <View className="mb-6 overflow-hidden rounded-[32px] border border-[#1E293B] bg-[#0C1320] px-5 pb-5 pt-5">
          <View className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-[#2563EB]/15" />
          <View className="absolute -left-6 bottom-0 h-20 w-20 rounded-full bg-[#F59E0B]/10" />

          <View className="mb-5 flex-row items-start justify-between gap-4">
            <View className="flex-1">
              <Typography variant="caption" weight="bold" className="mb-2 uppercase tracking-[0.28em] text-[#BFDBFE]">
                Automatización macro
              </Typography>
              <Typography variant="h1" weight="bold" className="text-text-primary">
                Alertas
              </Typography>
              <Typography variant="body" color="secondary" weight="medium" className="mt-2 leading-6">
                Configura reglas para no depender de mirar la agenda manualmente en cada tramo de sesión.
              </Typography>
            </View>

            <TouchableOpacity
              onPress={() => setCreateModalVisible(true)}
              activeOpacity={0.85}
              className="h-14 w-14 items-center justify-center rounded-[20px] bg-[#3B82F6]"
            >
              <Plus size={24} color="#fff" strokeWidth={3} />
            </TouchableOpacity>
          </View>

          <View className="flex-row gap-3">
            <View className="flex-1 rounded-[24px] border border-[#1F3A2C] bg-[#0B1B17] px-4 py-4">
              <View className="mb-2 flex-row items-center gap-2">
                <BellRing size={15} color="#34D399" strokeWidth={2.4} />
                <Typography variant="caption" weight="bold" className="uppercase tracking-[0.2em] text-[#6EE7B7]">
                  Activas
                </Typography>
              </View>
              <Typography variant="h3" weight="bold" className="text-text-primary">
                {activeAlerts}
              </Typography>
            </View>

            <View className="flex-1 rounded-[24px] border border-[#4C3A13] bg-[#1D1810] px-4 py-4">
              <View className="mb-2 flex-row items-center gap-2">
                <PauseCircle size={15} color="#FBBF24" strokeWidth={2.4} />
                <Typography variant="caption" weight="bold" className="uppercase tracking-[0.2em] text-[#FCD34D]">
                  Pausadas
                </Typography>
              </View>
              <Typography variant="h3" weight="bold" className="text-text-primary">
                {pausedAlerts}
              </Typography>
            </View>

            <View className="flex-1 rounded-[24px] border border-[#203047] bg-[#101A2B] px-4 py-4">
              <View className="mb-2 flex-row items-center gap-2">
                <ShieldAlert size={15} color="#93C5FD" strokeWidth={2.4} />
                <Typography variant="caption" weight="bold" className="uppercase tracking-[0.2em] text-[#BFDBFE]">
                  Total
                </Typography>
              </View>
              <Typography variant="h3" weight="bold" className="text-text-primary">
                {totalAlerts}
              </Typography>
            </View>
          </View>
        </View>
      </View>

      {/* List */}
      <FlashList
        data={alerts}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <AnimatedCard index={index}>
            <AlertCard
              alert={item}
              onToggle={() => handleToggleAlert(item.id)}
              onDelete={() => handleDeleteAlert(item.id)}
            />
          </AnimatedCard>
        )}
        contentContainerStyle={{ padding: 24, paddingBottom: 120 }}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={() => alertsViewModel.loadAlerts()}
            tintColor="#3B82F6"
          />
        }
        ListEmptyComponent={
          isLoading ? (
            <View className="gap-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <AlertCardSkeleton key={i} />
              ))}
            </View>
          ) : (
            <View className="items-center px-8 pt-24">
              <View className="mb-5 h-20 w-20 items-center justify-center rounded-full border border-[#2F3640] bg-[#18181B]">
                <BellOff size={36} color="#94A3B8" strokeWidth={2} />
              </View>
              <Typography variant="h2" weight="bold" color="primary">
                No tienes alertas
              </Typography>
              <Typography variant="body" color="muted" className="mt-3 text-center leading-relaxed">
                Crea tu primera alerta para recibir notificaciones cuando se publiquen eventos económicos clave.
              </Typography>
              <TouchableOpacity
                className="mt-6 flex-row items-center gap-2 rounded-full bg-[#3B82F6] px-8 py-4"
                onPress={() => setCreateModalVisible(true)}
              >
                <Plus size={20} color="#fff" strokeWidth={3} />
                <Typography variant="body" weight="bold" className="text-text-primary">
                  Crear primera alerta
                </Typography>
              </TouchableOpacity>
            </View>
          )
        }
        showsVerticalScrollIndicator={false}
      />

      <CreateAlertModal
        visible={createModalVisible}
        onClose={() => setCreateModalVisible(false)}
        onCreate={handleCreateAlert}
        availableCountries={eventsViewModel.availableCountries}
      />
    </View>
  );
});
