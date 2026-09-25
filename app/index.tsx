import { Redirect } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';
import { COLORS } from '../constants/colors';
import { useAuthStore } from '../store/authStore';

export default function Index() {
  const token = useAuthStore((s) => s.token);
  const carregando = useAuthStore((s) => s.carregando);

  if (carregando) {
    return (
      <View style={{ flex: 1, backgroundColor: COLORS.bg, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator color={COLORS.accent} size="large" />
      </View>
    );
  }

  if (token) return <Redirect href="/(tabs)/home" />;
  return <Redirect href="/login" />;
}
