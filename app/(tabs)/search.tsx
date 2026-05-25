// Busca de veículo — chips de marca, lista de modelos, inputs, call à specService
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
import { COLORS } from '../../constants/colors';
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
      {/* ── Marca ── */}
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

      {/* ── Modelos sugeridos ── */}
      {modelosSugeridos.length > 0 && (
        <>
          <Text style={[styles.secaoLabel, { marginTop: 20 }]}>MODELOS SUGERIDOS</Text>
          <FlatList
            data={modelosSugeridos}
            keyExtractor={(item) => item}
            scrollEnabled={false}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[styles.modeloItem, modelo === item && styles.modeloItemAtivo]}
                onPress={() => selecionarModelo(item)}
                activeOpacity={0.7}
              >
                <Text style={[styles.modeloTexto, modelo === item && styles.modeloTextoAtivo]}>
                  {item}
                </Text>
                {modelo === item && <Text style={styles.checkmark}>✓</Text>}
              </TouchableOpacity>
            )}
          />
        </>
      )}

      {/* ── Modelo livre ── */}
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

      {/* ── Versão ── */}
      <Text style={[styles.secaoLabel, { marginTop: 20 }]}>VERSÃO (opcional)</Text>
      <TextInput
        style={styles.input}
        value={versao}
        onChangeText={setVersao}
        placeholder="Ex: V6 Highline 4x4"
        placeholderTextColor={COLORS.textMuted}
        autoCapitalize="words"
      />

      {/* ── Ano ── */}
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

      {/* ── Botão ── */}
      <TouchableOpacity
        style={[styles.botao, buscando && styles.botaoInativo]}
        onPress={buscar}
        disabled={buscando}
        activeOpacity={0.85}
      >
        {buscando ? (
          <View style={styles.botaoConteudo}>
            <ActivityIndicator color={COLORS.black} size="small" />
            <Text style={styles.botaoTexto}>Gerando ficha...</Text>
          </View>
        ) : (
          <Text style={styles.botaoTexto}>Gerar Ficha Técnica</Text>
        )}
      </TouchableOpacity>

      <Text style={styles.dica}>
        💡 Ford Ranger Raptor retorna ficha 100% completa como validação
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: COLORS.background },
  container: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 48 },

  secaoLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.textSecondary,
    letterSpacing: 1,
    marginBottom: 10,
  },

  // Chips de marca
  chipsScroll: { marginBottom: 12 },
  chipsRow: { flexDirection: 'row', gap: 8, paddingRight: 4 },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  chipAtivo: {
    backgroundColor: COLORS.fordYellow,
    borderColor: COLORS.fordYellow,
  },
  chipTexto: { fontSize: 13, fontWeight: '600', color: COLORS.textSecondary },
  chipTextoAtivo: { color: COLORS.black },

  // Input
  input: {
    height: 48,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    paddingHorizontal: 14,
    fontSize: 14,
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  inputErro: { borderColor: COLORS.error },
  erroTexto: { fontSize: 12, color: COLORS.error, marginBottom: 4 },

  // Modelos sugeridos
  modeloItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 14,
    backgroundColor: COLORS.surface,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 6,
  },
  modeloItemAtivo: {
    borderColor: COLORS.fordYellow,
    backgroundColor: COLORS.surfaceAlt,
  },
  modeloTexto: { fontSize: 14, color: COLORS.textPrimary },
  modeloTextoAtivo: { color: COLORS.fordYellow, fontWeight: '700' },
  checkmark: { fontSize: 14, color: COLORS.fordYellow, fontWeight: '700' },

  // Botão
  botao: {
    height: 54,
    backgroundColor: COLORS.fordYellow,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 28,
    marginBottom: 16,
  },
  botaoInativo: { opacity: 0.7 },
  botaoConteudo: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  botaoTexto: { fontSize: 16, fontWeight: '700', color: COLORS.black, letterSpacing: 0.3 },

  dica: {
    fontSize: 12,
    color: COLORS.textMuted,
    textAlign: 'center',
    lineHeight: 18,
  },
});
