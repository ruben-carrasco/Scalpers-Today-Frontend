import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { View, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Typography } from '../../src/presentation/components/common/Typography';
import { useHaptics } from '../../src/presentation/hooks/useHaptics';

function CustomTabBar({ state, descriptors, navigation }: any) {
  const insets = useSafeAreaInsets();
  const haptics = useHaptics();

  return (
    <View
      style={{ paddingBottom: insets.bottom + 10, backgroundColor: '#000000' }}
      className="px-4 pb-4 pt-2"
    >
      <View className="overflow-hidden rounded-[30px] border border-[#22252C] bg-[#090B10] px-2 py-2">
        <View className="absolute inset-x-6 top-0 h-px bg-[#1E293B]" />
        <View className="flex-row gap-2">
          {state.routes.map((route: any, index: number) => {
            const { options } = descriptors[route.key];
            const label =
              options.tabBarLabel !== undefined
                ? options.tabBarLabel
                : options.title !== undefined
                  ? options.title
                  : route.name;
            const isFocused = state.index === index;

            const onPress = () => {
              const event = navigation.emit({
                type: 'tabPress',
                target: route.key,
                canPreventDefault: true,
              });

              if (!isFocused && !event.defaultPrevented) {
                haptics.selection();
                navigation.navigate(route.name);
              }
            };

            const Icon = options.tabBarIcon;
            const color = isFocused ? '#F8FAFC' : '#71717A';

            return (
              <TouchableOpacity
                key={route.key}
                onPress={onPress}
                activeOpacity={0.82}
                className={`flex-1 items-center justify-center rounded-[22px] px-2 py-3 ${isFocused ? 'bg-[#141B28]' : 'bg-transparent'}`}
                style={
                  isFocused
                    ? {
                        borderWidth: 1,
                        borderColor: '#263244',
                        shadowColor: '#60A5FA',
                        shadowOpacity: 0.14,
                        shadowRadius: 12,
                        shadowOffset: { width: 0, height: 4 },
                      }
                    : undefined
                }
              >
                <View
                  className={`mb-1.5 rounded-full px-3 py-2 ${isFocused ? 'bg-[#0F172A]' : 'bg-transparent'}`}
                >
                  <Icon color={color} focused={isFocused} />
                </View>
                <Typography
                  variant="caption"
                  weight={isFocused ? 'bold' : 'medium'}
                  style={{ color, fontSize: 11 }}
                >
                  {label}
                </Typography>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </View>
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      tabBar={props => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        sceneStyle: { backgroundColor: '#000000' },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Inicio',
          tabBarLabel: 'Inicio',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'home' : 'home-outline'} size={22} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="events"
        options={{
          title: 'Eventos',
          tabBarLabel: 'Eventos',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'calendar' : 'calendar-outline'} size={22} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="alerts"
        options={{
          title: 'Alertas',
          tabBarLabel: 'Alertas',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? 'notifications' : 'notifications-outline'}
              size={22}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Ajustes',
          tabBarLabel: 'Ajustes',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'settings' : 'settings-outline'} size={22} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
