// Root layout — configura navegação e restaura sessão ao iniciar
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { COLORS } from '../constants/colors';
import { requestPermissions } from '../services/notificationService';
import { useAuthStore } from '../store/authStore';
import { useVehicleStore } from '../store/vehicleStore';

export { ErrorBoundary } from 'expo-router';

export default function RootLayout() {
  const restaurarSessao = useAuthStore((s) => s.restaurarSessao);
  const carregarFichas = useVehicleStore((s) => s.carregarDoStorage);

  useEffect(() => {
    restaurarSessao();
    carregarFichas();
    requestPermissions();
  }, []);

  return (
    <>
      <StatusBar style="light" backgroundColor={COLORS.background} />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: COLORS.surface },
          headerTintColor: COLORS.textPrimary,
          headerTitleStyle: { fontWeight: '700', fontSize: 16 },
          contentStyle: { backgroundColor: COLORS.background },
          headerShadowVisible: false,
          animation: 'fade',
        }}
      >
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </>
  );
}
