import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS } from '../../constants/colors';
import { useAuthStore } from '../../store/authStore';
import { confirmar } from '../../utils/confirm';

export function LogoutButton() {
  const logout = useAuthStore((s) => s.logout);

  function handlePress() {
    confirmar('Sair da conta', 'Deseja encerrar a sessão?', 'Sair', async () => {
      await logout();
      router.replace('/login');
    }, true);
  }

  return (
    <TouchableOpacity
      onPress={handlePress}
      hitSlop={8}
      style={styles.botao}
      accessibilityRole="button"
      accessibilityLabel="Sair da conta"
    >
      <Ionicons name="log-out-outline" size={24} color={COLORS.textPrimary} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  botao: { marginRight: 12, padding: 6 },
});
