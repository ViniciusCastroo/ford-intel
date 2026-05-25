import { Link, Stack } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { COLORS } from '../constants/colors';

export default function NotFound() {
  return (
    <>
      <Stack.Screen options={{ title: 'Oops!' }} />
      <View style={styles.container}>
        <Text style={styles.title}>Tela não encontrada</Text>
        <Link href="/" style={styles.link}>
          <Text>Voltar ao início</Text>
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: COLORS.background },
  title: { fontSize: 20, fontWeight: '700', color: COLORS.textPrimary, marginBottom: 16 },
  link: { color: COLORS.fordYellow },
});
