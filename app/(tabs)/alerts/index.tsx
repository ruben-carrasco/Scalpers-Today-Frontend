import { useEffect, useState } from 'react';
import { View, TouchableOpacity, RefreshControl, Alert, StatusBar } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Plus, BellOff } from 'lucide-react-native';
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
  }, []);

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

  return (
    <View className="flex-1 bg-bg-primary">
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View style={{ paddingTop: insets.top + 20 }} className="px-6 pb-4 bg-bg-primary">
        <View className="flex-row justify-between items-end">
          <View>
            <Typography variant="h1" weight="bold" className="text-text-primary">Alertas</Typography>
            <Typography variant="body" color="muted" weight="medium" className="mt-1">
              {activeAlerts} activas · {pausedAlerts} pausadas
            </Typography>
          </View>
          <TouchableOpacity
            onPress={() => setCreateModalVisible(true)}
            className="w-12 h-12 rounded-full bg-[#3B82F6] items-center justify-center shadow-lg"
          >
            <Plus size={24} color="#fff" strokeWidth={3} />
          </TouchableOpacity>
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
            <View className="items-center pt-24 px-8 gap-4">
              <View className="w-20 h-20 rounded-full bg-[#18181B] items-center justify-center mb-2">
                <BellOff size={40} color="#52525B" strokeWidth={2} />
              </View>
              <Typography variant="h2" weight="bold" color="primary">No tienes alertas</Typography>
              <Typography variant="body" color="muted" className="text-center leading-relaxed">
                Crea tu primera alerta para recibir notificaciones cuando se publiquen eventos económicos clave.
              </Typography>
              <TouchableOpacity
                className="mt-6 bg-[#3B82F6] px-8 py-4 rounded-full flex-row items-center gap-2"
                onPress={() => setCreateModalVisible(true)}
              >
                <Plus size={20} color="#fff" strokeWidth={3} />
                <Typography variant="body" weight="bold" className="text-text-primary">Crear primera alerta</Typography>
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
