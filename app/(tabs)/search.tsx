import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { COLORS, RADIUS } from '../../constants/colors';
import { MARCAS, VEICULOS_POR_MARCA } from '../../constants/vehicles';
import { gerarFicha } from '../../services/specService';
import { useVehicleStore } from '../../store/vehicleStore';

export default function SearchScreen() {
  const [marca, setMarca] = useState('');
  const [modelo, setModelo] = useState('');
  const [versao, setVersao] = useState('');
  const [anoTexto, setAnoTexto] = useState('');
  const [buscando, setBuscando] = useState(false);
  const [erros, setErros] = useState<{ marca?: string; modelo?: string }>({});

  const setFichaAtual = useVehicleStore((s) => s.setFichaAtual);
  const salvarFicha = useVehicleStore((s) => s.salvarFicha);

  const modelosSugeridos = marca ? (VEICULOS_POR_MARCA[marca] ?? []) : [];

  function selecionarMarca(m: string) {
    setMarca(m);
    setModelo('');
    setErros((e) => ({ ...e, marca: undefined }));
  }

  function selecionarModelo(m: string) {
    setModelo(m);
    setErros((e) => ({ ...e, modelo: undefined }));
  }

  function validar(): boolean {
    const novosErros: { marca?: string; modelo?: string } = {};
    if (!marca.trim()) novosErros.marca = 'Selecione ou informe a marca';
    if (!modelo.trim()) novosErros.modelo = 'Informe o modelo';
    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  }

  async function buscar() {
    if (!validar()) return;
    setBuscando(true);
    try {
      const ano = anoTexto.trim() ? parseInt(anoTexto.trim(), 10) : undefined;
      const ficha = await gerarFicha({ marca: marca.trim(), modelo: modelo.trim(), versao: versao.trim(), ano });
      setFichaAtual(ficha);
      await salvarFicha(ficha, { marca: marca.trim(), modelo: modelo.trim(), versao: versao.trim(), ano });
      router.push('/(tabs)/result');
    } catch {
      setErros({ modelo: 'Erro ao gerar ficha. Tente novamente.' });
    } finally {
      setBuscando(false);
    }
  }

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.secaoLabel}>MARCA</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipsScroll}>
        <View style={styles.chipsRow}>
          {MARCAS.map((m) => (
            <TouchableOpacity
              key={m}
              style={[styles.chip, marca === m && styles.chipAtivo]}
              onPress={() => selecionarMarca(m)}
              activeOpacity={0.7}
            >
              <Text style={[styles.chipTexto, marca === m && styles.chipTextoAtivo]}>{m}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <TextInput
        style={[styles.input, erros.marca ? styles.inputErro : null]}
        value={marca}
        onChangeText={(v) => { setMarca(v); setErros((e) => ({ ...e, marca: undefined })); }}
        placeholder="Ou digite a marca..."
        placeholderTextColor={COLORS.textMuted}
        autoCapitalize="words"
      />
      {erros.marca && <Text style={styles.erroTexto}>{erros.marca}</Text>}

      {modelosSugeridos.length > 0 && (
        <>
          <Text style={[styles.secaoLabel, { marginTop: 20 }]}>MODELOS SUGERIDOS</Text>
          <FlatList
            data={modelosSugeridos}
            keyExtractor={(item) => item}
            scrollEnabled={false}
            style={styles.modelosLista}
            ItemSeparatorComponent={() => <View style={styles.modeloSeparador} />}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[styles.modeloItem, modelo === item && styles.modeloItemAtivo]}
                onPress={() => selecionarModelo(item)}
                activeOpacity={0.7}
              >
                <Text style={[styles.modeloTexto, modelo === item && styles.modeloTextoAtivo]}>
                  {item}
                </Text>
                {modelo === item && <Ionicons name="checkmark" size={18} color={COLORS.accent} />}
              </TouchableOpacity>
            )}
          />
        </>
      )}

      <Text style={[styles.secaoLabel, { marginTop: 20 }]}>MODELO</Text>
      <TextInput
        style={[styles.input, erros.modelo ? styles.inputErro : null]}
        value={modelo}
        onChangeText={(v) => { setModelo(v); setErros((e) => ({ ...e, modelo: undefined })); }}
        placeholder="Ex: Ranger Raptor"
        placeholderTextColor={COLORS.textMuted}
        autoCapitalize="words"
      />
      {erros.modelo && <Text style={styles.erroTexto}>{erros.modelo}</Text>}

      <Text style={[styles.secaoLabel, { marginTop: 20 }]}>VERSÃO (opcional)</Text>
      <TextInput
        style={styles.input}
        value={versao}
        onChangeText={setVersao}
        placeholder="Ex: V6 Highline 4x4"
        placeholderTextColor={COLORS.textMuted}
        autoCapitalize="words"
      />

      <Text style={[styles.secaoLabel, { marginTop: 20 }]}>ANO (opcional)</Text>
      <TextInput
        style={styles.input}
        value={anoTexto}
        onChangeText={setAnoTexto}
        placeholder="Ex: 2024"
        placeholderTextColor={COLORS.textMuted}
        keyboardType="number-pad"
        maxLength={4}
      />

      <TouchableOpacity
        style={[styles.botao, buscando && styles.botaoInativo]}
        onPress={buscar}
        disabled={buscando}
        activeOpacity={0.85}
      >
        {buscando ? (
          <View style={styles.botaoConteudo}>
            <ActivityIndicator color={COLORS.onAccent} size="small" />
            <Text style={styles.botaoTexto}>Gerando ficha...</Text>
          </View>
        ) : (
          <Text style={styles.botaoTexto}>Gerar Ficha Técnica</Text>
        )}
      </TouchableOpacity>

      <View style={styles.dicaLinha}>
        <Ionicons name="bulb-outline" size={14} color={COLORS.textMuted} />
        <Text style={styles.dica}>
          Ford Ranger Raptor retorna ficha 100% completa como validação
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: COLORS.bg },
  container: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 48 },

  secaoLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.textSecondary,
    letterSpacing: 1,
    marginBottom: 10,
  },

  chipsScroll: { marginBottom: 12 },
  chipsRow: { flexDirection: 'row', gap: 8, paddingRight: 4 },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: RADIUS.pill,
    backgroundColor: COLORS.surface,
  },
  chipAtivo: {
    backgroundColor: COLORS.accent,
  },
  chipTexto: { fontSize: 13, fontWeight: '600', color: COLORS.textSecondary },
  chipTextoAtivo: { color: COLORS.onAccent },

  input: {
    height: 48,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.transparent,
    borderRadius: RADIUS.sm,
    paddingHorizontal: 14,
    fontSize: 14,
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  inputErro: { borderColor: COLORS.error },
  erroTexto: { fontSize: 12, color: COLORS.error, marginBottom: 4 },

  modelosLista: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    overflow: 'hidden',
  },
  modeloSeparador: { height: StyleSheet.hairlineWidth, backgroundColor: COLORS.divider },
  modeloItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 14,
  },
  modeloItemAtivo: {
    backgroundColor: COLORS.surfaceElevated,
  },
  modeloTexto: { fontSize: 14, color: COLORS.textPrimary },
  modeloTextoAtivo: { color: COLORS.accent, fontWeight: '700' },

  botao: {
    height: 54,
    backgroundColor: COLORS.accent,
    borderRadius: RADIUS.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 28,
    marginBottom: 16,
  },
  botaoInativo: { opacity: 0.7 },
  botaoConteudo: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  botaoTexto: { fontSize: 16, fontWeight: '700', color: COLORS.onAccent, letterSpacing: 0.3 },

  dicaLinha: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 },
  dica: {
    flexShrink: 1,
    fontSize: 12,
    color: COLORS.textMuted,
    textAlign: 'center',
    lineHeight: 18,
  },
});
