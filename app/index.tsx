// Ponto de entrada — redireciona para login ou home conforme sessão
import { Redirect } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';
import { COLORS } from '../constants/colors';
import { useAuthStore } from '../store/authStore';

export default function Index() {
  const token = useAuthStore((s) => s.token);
  const carregando = useAuthStore((s) => s.carregando);

  // Aguarda restauração da sessão antes de redirecionar
  if (carregando) {
    return (
      <View style={{ flex: 1, backgroundColor: COLORS.background, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator color={COLORS.fordYellow} size="large" />
      </View>
    );
  }

  if (token) return <Redirect href="/(tabs)/home" />;
  return <Redirect href="/login" />;
}
