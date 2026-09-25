import { router } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { FordLogo } from '../components/ui/FordLogo';
import { COLORS, RADIUS } from '../constants/colors';
import { useAuthStore } from '../store/authStore';

export default function LoginScreen() {
  const [email, setEmail] = useState('analista@ford.com');
  const [senha, setSenha] = useState('ford2026');
  const [erro, setErro] = useState<string | null>(null);

  const { login, carregando } = useAuthStore();

  async function handleLogin() {
    if (!email.trim() || !senha.trim()) {
      setErro('Preencha e-mail e senha.');
      return;
    }
    setErro(null);
    try {
      await login(email.trim(), senha);
      router.replace('/(tabs)/home');
    } catch (e: unknown) {
      setErro(e instanceof Error ? e.message : 'Erro ao fazer login.');
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.logoArea}>
          <FordLogo height={88} />
          <Text style={styles.appSub}>INTELIGÊNCIA COMPETITIVA AUTOMOTIVA</Text>
        </View>

        <View style={styles.form}>
          <Text style={styles.formTitulo}>Entrar</Text>

          <View style={styles.campo}>
            <Text style={styles.campoLabel}>E-MAIL</Text>
            <TextInput
              style={[styles.input, erro ? styles.inputErro : null]}
              value={email}
              onChangeText={(v) => { setEmail(v); setErro(null); }}
              placeholder="analista@ford.com"
              placeholderTextColor={COLORS.textMuted}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              editable={!carregando}
            />
          </View>

          <View style={styles.campo}>
            <Text style={styles.campoLabel}>SENHA</Text>
            <TextInput
              style={[styles.input, erro ? styles.inputErro : null]}
              value={senha}
              onChangeText={(v) => { setSenha(v); setErro(null); }}
              placeholder="••••••••"
              placeholderTextColor={COLORS.textMuted}
              secureTextEntry
              autoComplete="password"
              returnKeyType="done"
              onSubmitEditing={handleLogin}
              editable={!carregando}
            />
          </View>

          {erro !== null && (
            <Text style={styles.erroTexto}>{erro}</Text>
          )}

          <TouchableOpacity
            style={[styles.botao, carregando && styles.botaoInativo]}
            onPress={handleLogin}
            disabled={carregando}
            activeOpacity={0.8}
          >
            {carregando
              ? <ActivityIndicator color={COLORS.onAccent} size="small" />
              : <Text style={styles.botaoTexto}>Entrar</Text>
            }
          </TouchableOpacity>

          <Text style={styles.dica}>Demo: analista@ford.com · ford2026</Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: COLORS.bg },
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 48,
  },

  logoArea: { alignItems: 'center', marginBottom: 44 },
  appSub: {
    marginTop: 20,
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.textMuted,
    letterSpacing: 1.5,
    textAlign: 'center',
  },

  form: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: 24,
  },
  formTitulo: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 24,
  },
  campo: { marginBottom: 16 },
  campoLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.textSecondary,
    letterSpacing: 1,
    marginBottom: 6,
  },
  input: {
    height: 48,
    backgroundColor: COLORS.surfaceElevated,
    borderWidth: 1,
    borderColor: COLORS.transparent,
    borderRadius: RADIUS.sm,
    paddingHorizontal: 14,
    fontSize: 14,
    color: COLORS.textPrimary,
  },
  inputErro: { borderColor: COLORS.error },

  erroTexto: {
    color: COLORS.error,
    fontSize: 13,
    marginBottom: 12,
  },

  botao: {
    height: 52,
    backgroundColor: COLORS.accent,
    borderRadius: RADIUS.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  botaoInativo: { opacity: 0.6 },
  botaoTexto: { fontSize: 16, fontWeight: '700', color: COLORS.onAccent, letterSpacing: 0.5 },

  dica: {
    fontSize: 12,
    color: COLORS.textMuted,
    textAlign: 'center',
    marginTop: 16,
  },
});
