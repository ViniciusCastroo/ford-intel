import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import type { IoniconName } from '../../components/ui/icon';
import { COLORS, RADIUS, TYPOGRAPHY } from '../../constants/colors';
import { useVehicleStore } from '../../store/vehicleStore';
import { formatarPreco } from '../../utils/format';
import type { SpecValue, TechSpecSheet } from '../../types/vehicle';

function LinhaComparacao({
  label,
  valorA,
  valorB,
  maiorMelhor = true,
}: {
  label: string;
  valorA: SpecValue;
  valorB: SpecValue;
  maiorMelhor?: boolean;
}) {
  const aNum = typeof valorA === 'number' ? valorA : null;
  const bNum = typeof valorB === 'number' ? valorB : null;
  const aGanha = aNum !== null && bNum !== null && (maiorMelhor ? aNum > bNum : aNum < bNum);
  const bGanha = aNum !== null && bNum !== null && (maiorMelhor ? bNum > aNum : bNum < aNum);

  function fmt(v: SpecValue): string {
    if (v === null || v === undefined) return 'N/D';
    if (typeof v === 'number') return v.toLocaleString('pt-BR');
    return String(v);
  }

  return (
    <View style={styles.linha}>
      <Text style={styles.linhaLabel} numberOfLines={2}>{label}</Text>
      <Text
        style={[
          styles.linhaValor,
          aNum !== null && TYPOGRAPHY.numeric,
          aGanha && styles.valorVencedor,
          valorA === null && styles.valorNulo,
        ]}
        numberOfLines={2}
      >
        {fmt(valorA)}
      </Text>
      <Text
        style={[
          styles.linhaValor,
          bNum !== null && TYPOGRAPHY.numeric,
          bGanha && styles.valorVencedor,
          valorB === null && styles.valorNulo,
        ]}
        numberOfLines={2}
      >
        {fmt(valorB)}
      </Text>
    </View>
  );
}

function CabecalhoTabela({ fichaA, fichaB }: { fichaA: TechSpecSheet; fichaB: TechSpecSheet }) {
  return (
    <View style={styles.cabecalho}>
      <View style={styles.cabecalhoLabel} />
      <View style={[styles.cabecalhoColuna, styles.colunaA]}>
        <Text style={styles.cabecalhoMarca}>{fichaA.veiculo.marca}</Text>
        <Text style={styles.cabecalhoModelo} numberOfLines={2}>{fichaA.veiculo.modelo}</Text>
        <Text style={styles.cabecalhoVersao} numberOfLines={1}>{fichaA.veiculo.versao}</Text>
        <Text style={styles.cabecalhoPreco}>{formatarPreco(fichaA.preco.fipe)}</Text>
      </View>
      <View style={[styles.cabecalhoColuna, styles.colunaB]}>
        <Text style={styles.cabecalhoMarca}>{fichaB.veiculo.marca}</Text>
        <Text style={styles.cabecalhoModelo} numberOfLines={2}>{fichaB.veiculo.modelo}</Text>
        <Text style={styles.cabecalhoVersao} numberOfLines={1}>{fichaB.veiculo.versao}</Text>
        <Text style={styles.cabecalhoPreco}>{formatarPreco(fichaB.preco.fipe)}</Text>
      </View>
    </View>
  );
}

function TituloSecao({ texto, icone }: { texto: string; icone: IoniconName }) {
  return (
    <View style={styles.tituloSecao}>
      <Ionicons name={icone} size={14} color={COLORS.brandLight} />
      <Text style={styles.tituloSecaoTexto}>{texto}</Text>
    </View>
  );
}

export default function CompareScreen() {
  const comparacao = useVehicleStore((s) => s.comparacao);
  const [fichaA, fichaB] = comparacao;

  if (!fichaA || !fichaB) {
    return (
      <View style={styles.vazio}>
        <Ionicons name="git-compare-outline" size={48} color={COLORS.textMuted} style={styles.vazioIcone} />
        <Text style={styles.vazioTitulo}>Nenhuma comparação</Text>
        <Text style={styles.vazioSub}>
          Na ficha técnica, toque em "Comparar (A)" ou "Comparar (B)" para selecionar dois veículos.
        </Text>
        {(!fichaA && !fichaB) ? (
          <Text style={styles.vazioStatus}>0 de 2 veículos selecionados</Text>
        ) : (
          <Text style={styles.vazioStatus}>
            {fichaA ? fichaA.veiculo.modelo : fichaB!.veiculo.modelo} selecionado — falta 1
          </Text>
        )}
        <TouchableOpacity
          style={styles.btnBuscar}
          onPress={() => router.push('/(tabs)/search')}
          activeOpacity={0.8}
        >
          <Ionicons name="search" size={16} color={COLORS.onAccent} />
          <Text style={styles.btnBuscarTexto}>Buscar veículo</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.scroll}
      showsVerticalScrollIndicator={false}
      stickyHeaderIndices={[0]}
    >
      <CabecalhoTabela fichaA={fichaA} fichaB={fichaB} />

      <View style={styles.container}>
        <TituloSecao texto="MOTOR & TRANSMISSÃO" icone="settings-outline" />
        <LinhaComparacao label="Cilindrada" valorA={fichaA.motor.cilindrada} valorB={fichaB.motor.cilindrada} />
        <LinhaComparacao label="Potência (cv)" valorA={fichaA.motor.potencia_cv} valorB={fichaB.motor.potencia_cv} />
        <LinhaComparacao label="Torque (Nm)" valorA={fichaA.motor.torque_nm} valorB={fichaB.motor.torque_nm} />
        <LinhaComparacao label="Combustível" valorA={fichaA.motor.combustivel} valorB={fichaB.motor.combustivel} />
        <LinhaComparacao label="Transmissão" valorA={fichaA.motor.transmissao} valorB={fichaB.motor.transmissao} />
        <LinhaComparacao label="Tração" valorA={fichaA.motor.tracao} valorB={fichaB.motor.tracao} />

        <TituloSecao texto="DIMENSÕES & CAPACIDADE" icone="resize-outline" />
        <LinhaComparacao label="Comprimento (mm)" valorA={fichaA.dimensoes.comprimento_mm} valorB={fichaB.dimensoes.comprimento_mm} />
        <LinhaComparacao label="Altura livre (mm)" valorA={fichaA.dimensoes.altura_livre_mm} valorB={fichaB.dimensoes.altura_livre_mm} />
        <LinhaComparacao label="Peso (kg)" valorA={fichaA.dimensoes.peso_kg} valorB={fichaB.dimensoes.peso_kg} maiorMelhor={false} />
        <LinhaComparacao label="Carga útil (kg)" valorA={fichaA.dimensoes.capacidade_carga_kg} valorB={fichaB.dimensoes.capacidade_carga_kg} />
        <LinhaComparacao label="Reboque (kg)" valorA={fichaA.dimensoes.capacidade_reboque_kg} valorB={fichaB.dimensoes.capacidade_reboque_kg} />

        <TituloSecao texto="EFICIÊNCIA" icone="speedometer-outline" />
        <LinhaComparacao label="Tanque (L)" valorA={fichaA.eficiencia.tanque_litros} valorB={fichaB.eficiencia.tanque_litros} />
        <LinhaComparacao label="Autonomia (km)" valorA={fichaA.eficiencia.autonomia_km} valorB={fichaB.eficiencia.autonomia_km} />

        <TituloSecao texto="SEGURANÇA" icone="shield-checkmark-outline" />
        <LinhaComparacao label="Airbags" valorA={fichaA.seguranca.airbags} valorB={fichaB.seguranca.airbags} />
        <LinhaComparacao label="ABS" valorA={fichaA.seguranca.abs} valorB={fichaB.seguranca.abs} />

        <TituloSecao texto="PREÇO FIPE" icone="cash-outline" />
        <LinhaComparacao label="Tabela FIPE" valorA={fichaA.preco.fipe} valorB={fichaB.preco.fipe} maiorMelhor={false} />
        <LinhaComparacao label="Referência" valorA={fichaA.preco.referencia} valorB={fichaB.preco.referencia} />

        <View style={styles.legenda}>
          <View style={styles.legendaItem}>
            <View style={[styles.legendaDot, { backgroundColor: COLORS.success }]} />
            <Text style={styles.legendaTexto}>Valor vencedor (verde)</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: COLORS.bg },
  container: { paddingBottom: 48 },

  vazio: {
    flex: 1,
    backgroundColor: COLORS.bg,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  vazioIcone: { marginBottom: 16 },
  vazioTitulo: { fontSize: 20, fontWeight: '700', color: COLORS.textPrimary, marginBottom: 8, textAlign: 'center' },
  vazioSub: { fontSize: 14, color: COLORS.textSecondary, textAlign: 'center', lineHeight: 20, marginBottom: 12 },
  vazioStatus: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.accent,
    marginBottom: 24,
    textAlign: 'center',
  },
  btnBuscar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: COLORS.accent,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: RADIUS.lg,
  },
  btnBuscarTexto: { fontSize: 15, fontWeight: '700', color: COLORS.onAccent },

  cabecalho: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  cabecalhoLabel: { flex: 1 },
  cabecalhoColuna: {
    flex: 1.2,
    padding: 12,
    borderLeftWidth: 1,
    borderLeftColor: COLORS.divider,
  },
  colunaA: { backgroundColor: COLORS.brand },
  colunaB: { backgroundColor: COLORS.brandMid },
  cabecalhoMarca: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.white,
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  cabecalhoModelo: { fontSize: 14, fontWeight: '800', color: COLORS.white, lineHeight: 18, marginBottom: 2 },
  cabecalhoVersao: { fontSize: 11, color: COLORS.white, marginBottom: 4 },
  cabecalhoPreco: { ...TYPOGRAPHY.numeric, fontSize: 12, fontWeight: '700', color: COLORS.white },

  tituloSecao: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: COLORS.surfaceElevated,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginTop: 8,
  },
  tituloSecaoTexto: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.textSecondary,
    letterSpacing: 0.8,
  },

  linha: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: COLORS.divider,
  },
  linhaLabel: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 12,
    color: COLORS.textSecondary,
    lineHeight: 16,
  },
  linhaValor: {
    flex: 1.2,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 12,
    fontWeight: '500',
    color: COLORS.textPrimary,
    borderLeftWidth: 1,
    borderLeftColor: COLORS.divider,
    lineHeight: 16,
  },
  valorVencedor: { color: COLORS.success, fontWeight: '700' },
  valorNulo: { color: COLORS.textMuted, fontStyle: 'italic' },

  legenda: {
    flexDirection: 'row',
    gap: 16,
    padding: 16,
    justifyContent: 'center',
  },
  legendaItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  legendaDot: { width: 10, height: 10, borderRadius: RADIUS.pill },
  legendaTexto: { fontSize: 11, color: COLORS.textMuted },
});
