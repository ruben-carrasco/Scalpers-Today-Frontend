import '../global.css';
import 'reflect-metadata';
import { useEffect, useState } from 'react';
import { Slot, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { observer } from 'mobx-react-lite';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { container } from '../src/core/container';
import { TYPES } from '../src/core/types';
import { AuthViewModel } from '../src/presentation/viewmodels/AuthViewModel';
import { ApiClient } from '../src/data/api/ApiClient';
import { notificationService } from '../src/services/NotificationService';
import { ErrorBoundary } from '../src/presentation/components/common/ErrorBoundary';

const authViewModel = container.get<AuthViewModel>(TYPES.AuthViewModel);

const RootLayoutNav = observer(function RootLayoutNav() {
  const router = useRouter();
  const segments = useSegments();
  const isAuthenticated = authViewModel.isAuthenticated;
  const inAuthGroup = segments[0] === '(auth)';
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const init = async () => {
      const apiClient = container.get<ApiClient>(TYPES.ApiClient);
      await apiClient.loadToken();

      apiClient.setOnUnauthorized(() => {
        authViewModel.logout();
      });

      await authViewModel.checkAuth();
      setIsReady(true);
    };

    init();

    notificationService.setupNotificationListeners(
      (notification) => {
        const { title, body } = notification.request.content;
        if (title || body) {
          Alert.alert(title || 'Nueva Alerta', body || '');
        }
      },
      (response) => {
        const data = response.notification.request.content.data;

        if (data?.type === 'event' && data?.eventId) {
          router.push(`/(tabs)/events?eventId=${data.eventId}`);
        } else if (data?.type === 'alert') {
          router.push('/(tabs)/alerts');
        }
      }
    );

    notificationService.getLastNotificationResponse().then((response) => {
      const data = response?.notification.request.content.data;
      if (data?.type === 'event' && data?.eventId) {
        router.replace(`/(tabs)/events?eventId=${data.eventId}`);
      } else if (data?.type === 'alert') {
        router.replace('/(tabs)/alerts');
      }
    });

    return () => {
      notificationService.removeNotificationListeners();
    };
  }, [router]);

  useEffect(() => {
    if (!isReady) return;

    if (!isAuthenticated && !inAuthGroup) {
      router.replace('/(auth)/login');
    } else if (isAuthenticated && inAuthGroup) {
      router.replace('/(tabs)');
    }
  }, [inAuthGroup, isAuthenticated, isReady, router]);

  if (!isReady) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#000000' }}>
        <ActivityIndicator size="large" color="#3B82F6" />
      </View>
    );
  }

  return <Slot />;
});

export default observer(function RootLayout() {
  return (
    <ErrorBoundary>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaProvider>
          <BottomSheetModalProvider>
            <StatusBar style="light" />
            <RootLayoutNav />
          </BottomSheetModalProvider>
        </SafeAreaProvider>
      </GestureHandlerRootView>
    </ErrorBoundary>
  );
});
