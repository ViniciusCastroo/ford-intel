// Tab navigator — 4 abas visíveis + result oculta
import { Ionicons } from '@expo/vector-icons';
import { router, Tabs } from 'expo-router';
import { TouchableOpacity } from 'react-native';
import { COLORS } from '../../constants/colors';

type IoniconName = React.ComponentProps<typeof Ionicons>['name'];

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: COLORS.fordYellow,
        tabBarInactiveTintColor: COLORS.textMuted,
        tabBarStyle: {
          backgroundColor: COLORS.surface,
          borderTopColor: COLORS.border,
          borderTopWidth: 1,
          height: 60,
          paddingBottom: 8,
          paddingTop: 6,
        },
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
        headerStyle: { backgroundColor: COLORS.surface },
        headerTintColor: COLORS.textPrimary,
        headerTitleStyle: { fontWeight: '700', fontSize: 16 },
        headerShadowVisible: false,
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'home' : 'home-outline'} size={22} color={color} />
          ),
          headerTitle: 'Ford Intel',
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: 'Buscar',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'search' : 'search-outline'} size={22} color={color} />
          ),
          headerTitle: 'Buscar Veículo',
        }}
      />
      <Tabs.Screen
        name="compare"
        options={{
          title: 'Comparar',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'git-compare' : 'git-compare-outline'} size={22} color={color} />
          ),
          headerTitle: 'Comparar Veículos',
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: 'Histórico',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'time' : 'time-outline'} size={22} color={color} />
          ),
          headerTitle: 'Histórico',
        }}
      />
      {/* Tela de resultado — oculta da tab bar */}
      <Tabs.Screen
        name="result"
        options={{
          href: null,
          headerTitle: 'Ficha Técnica',
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => router.back()}
              hitSlop={8}
              style={{ marginLeft: 4, padding: 8 }}
            >
              <Ionicons name="arrow-back" size={22} color={COLORS.textPrimary} />
            </TouchableOpacity>
          ),
        }}
      />
    </Tabs>
  );
}
