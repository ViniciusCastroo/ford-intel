import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import {
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import type { IoniconName } from '../../components/ui/icon';
import { COLORS, RADIUS, TYPOGRAPHY } from '../../constants/colors';
import { useVehicleStore } from '../../store/vehicleStore';
import { confirmar } from '../../utils/confirm';
import { formatarData, formatarPreco } from '../../utils/format';
import type { BuscaSalva, VehicleCategory } from '../../types/vehicle';

function GraficoBarras({
  fichas,
  onPress,
}: {
  fichas: BuscaSalva[];
  onPress: (item: BuscaSalva) => void;
}) {
  const comPreco = fichas.filter((f) => typeof f.ficha.preco.fipe === 'number');
  if (comPreco.length < 2) return null;

  const maxPreco = Math.max(...comPreco.map((f) => f.ficha.preco.fipe as number));

  return (
    <View style={styles.grafico}>
      <Text style={styles.graficoTitulo}>PREÇOS COMPARADOS (FIPE)</Text>
      <View style={styles.graficoBars}>
        {comPreco.slice(0, 8).map((f) => {
          const preco = f.ficha.preco.fipe as number;
          const pct = maxPreco > 0 ? (preco / maxPreco) * 100 : 0;
          const isFord = f.ficha.veiculo.marca.toLowerCase() === 'ford';
          return (
            <TouchableOpacity
              key={f.id}
              style={styles.barraItem}
              onPress={() => onPress(f)}
              activeOpacity={0.7}
            >
              <View style={styles.barraWrap}>
                <View
                  style={[
                    styles.barra,
                    { height: `${Math.max(pct, 5)}%` },
                    isFord ? styles.barraFord : styles.barraNormal,
                  ]}
                />
              </View>
              <Text style={styles.barraLabel} numberOfLines={2}>
                {f.ficha.veiculo.modelo.split(' ')[0]}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
      <View style={styles.graficoLegenda}>
        <View style={[styles.legendaDot, { backgroundColor: COLORS.brandLight }]} />
        <Text style={styles.legendaTexto}>Ford</Text>
        <View style={[styles.legendaDot, { backgroundColor: COLORS.chartNeutral }]} />
        <Text style={styles.legendaTexto}>Concorrente</Text>
      </View>
    </View>
  );
}

function ItemHistorico({
  item,
  onPress,
  onDelete,
  onFavorito,
}: {
  item: BuscaSalva;
  onPress: () => void;
  onDelete: () => void;
  onFavorito: () => void;
}) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8} style={styles.item}>
      <View style={styles.itemEsquerda}>
        <Text style={styles.itemMarca}>{item.ficha.veiculo.marca.toUpperCase()}</Text>
        <Text style={styles.itemModelo}>{item.ficha.veiculo.modelo}</Text>
        <Text style={styles.itemVersao} numberOfLines={1}>
          {item.ficha.veiculo.versao || '—'}
          {item.ficha.veiculo.ano ? ` · ${item.ficha.veiculo.ano}` : ''}
        </Text>
        <Text style={styles.itemData}>{formatarData(item.salvoEm)}</Text>
      </View>
      <View style={styles.itemDireita}>
        <Text style={styles.itemPreco}>{formatarPreco(item.ficha.preco.fipe)}</Text>
        <View style={styles.itemAcoes}>
          <TouchableOpacity
            onPress={onFavorito}
            hitSlop={8}
            style={styles.iconBtn}
            accessibilityRole="button"
            accessibilityLabel={item.favorito ? 'Remover dos favoritos' : 'Favoritar'}
          >
            <Ionicons
              name={item.favorito ? 'star' : 'star-outline'}
              size={20}
              color={item.favorito ? COLORS.accent : COLORS.textMuted}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={onDelete}
            hitSlop={8}
            style={styles.iconBtn}
            accessibilityRole="button"
            accessibilityLabel="Excluir ficha"
          >
            <Ionicons name="trash-outline" size={20} color={COLORS.danger} />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
}

type Filtro = 'todos' | 'favoritos' | VehicleCategory;

const FILTROS: { id: Filtro; label: string; icone?: IoniconName }[] = [
  { id: 'todos', label: 'Todos' },
  { id: 'favoritos', label: 'Favoritos', icone: 'star-outline' },
  { id: 'pickup', label: 'Pickups' },
  { id: 'suv', label: 'SUVs' },
  { id: 'sedan', label: 'Sedans' },
  { id: 'hatch', label: 'Hatch' },
];

export default function HistoryScreen() {
  const [filtro, setFiltro] = useState<Filtro>('todos');

  const fichas = useVehicleStore((s) => s.fichas);
  const removerFicha = useVehicleStore((s) => s.removerFicha);
  const toggleFavorito = useVehicleStore((s) => s.toggleFavorito);
  const setFichaAtual = useVehicleStore((s) => s.setFichaAtual);

  const fichasFiltradas = fichas.filter((f) => {
    if (filtro === 'todos') return true;
    if (filtro === 'favoritos') return f.favorito;
    return f.ficha.veiculo.categoria === filtro;
  });

  function handleDelete(item: BuscaSalva) {
    confirmar(
      'Excluir ficha',
      `Remover ${item.ficha.veiculo.marca} ${item.ficha.veiculo.modelo} do histórico?`,
      'Excluir',
      () => removerFicha(item.id),
      true,
    );
  }

  function handlePress(item: BuscaSalva) {
    setFichaAtual(item.ficha);
    router.push('/(tabs)/result');
  }

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filtrosScroll}
        contentContainerStyle={styles.filtrosWrap}
      >
        {FILTROS.map((f) => {
          const count = f.id === 'todos'
            ? fichas.length
            : f.id === 'favoritos'
            ? fichas.filter((x) => x.favorito).length
            : fichas.filter((x) => x.ficha.veiculo.categoria === f.id).length;

          return (
            <TouchableOpacity
              key={f.id}
              style={[styles.chip, filtro === f.id && styles.chipAtivo]}
              onPress={() => setFiltro(f.id)}
              activeOpacity={0.7}
            >
              {f.icone && (
                <Ionicons
                  name={f.icone}
                  size={13}
                  color={filtro === f.id ? COLORS.onAccent : COLORS.textSecondary}
                />
              )}
              <Text style={[styles.chipTexto, filtro === f.id && styles.chipTextoAtivo]}>
                {f.label} ({count})
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <FlatList
        data={fichasFiltradas}
        keyExtractor={(item) => item.id}
        contentContainerStyle={fichasFiltradas.length === 0 ? styles.vazioFlex : styles.listaConteudo}
        ItemSeparatorComponent={() => <View style={styles.separador} />}
        ListHeaderComponent={fichas.length >= 2 ? <GraficoBarras fichas={fichas} onPress={handlePress} /> : null}
        renderItem={({ item }) => (
          <ItemHistorico
            item={item}
            onPress={() => handlePress(item)}
            onDelete={() => handleDelete(item)}
            onFavorito={() => toggleFavorito(item.id)}
          />
        )}
        ListEmptyComponent={
          <View style={styles.vazio}>
            <Ionicons
              name={filtro === 'favoritos' ? 'star-outline' : 'document-text-outline'}
              size={48}
              color={COLORS.textMuted}
              style={styles.vazioIcone}
            />
            <Text style={styles.vazioTitulo}>
              {filtro === 'favoritos' ? 'Nenhum favorito' : 'Histórico vazio'}
            </Text>
            <Text style={styles.vazioSub}>
              {filtro === 'favoritos'
                ? 'Marque fichas com estrela para vê-las aqui.'
                : 'Busque um veículo para começar.'}
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },

  filtrosScroll: {
    flexGrow: 0,
    flexShrink: 0,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: COLORS.divider,
  },
  filtrosWrap: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: RADIUS.pill,
    backgroundColor: COLORS.surface,
  },
  chipAtivo: { backgroundColor: COLORS.accent },
  chipTexto: { fontSize: 12, fontWeight: '600', color: COLORS.textSecondary },
  chipTextoAtivo: { color: COLORS.onAccent },

  grafico: {
    margin: 16,
    marginBottom: 4,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    padding: 14,
  },
  graficoTitulo: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.textMuted,
    letterSpacing: 1,
    marginBottom: 12,
  },
  graficoBars: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 80,
    gap: 6,
  },
  barraItem: { flex: 1, alignItems: 'center', height: '100%' },
  barraWrap: { flex: 1, width: '100%', justifyContent: 'flex-end' },
  barra: { width: '100%', borderRadius: RADIUS.xs },
  barraFord: { backgroundColor: COLORS.brandLight },
  barraNormal: { backgroundColor: COLORS.chartNeutral },
  barraLabel: {
    fontSize: 9,
    color: COLORS.textMuted,
    textAlign: 'center',
    marginTop: 4,
    lineHeight: 11,
  },
  graficoLegenda: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 10 },
  legendaDot: { width: 8, height: 8, borderRadius: RADIUS.pill },
  legendaTexto: { fontSize: 10, color: COLORS.textMuted, marginRight: 8 },

  listaConteudo: { paddingBottom: 48 },
  vazioFlex: { flex: 1, justifyContent: 'center' },
  separador: { height: StyleSheet.hairlineWidth, backgroundColor: COLORS.divider, marginLeft: 16 },

  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  itemEsquerda: { flex: 1, marginRight: 12 },
  itemMarca: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.textMuted,
    letterSpacing: 1,
    marginBottom: 2,
  },
  itemModelo: { fontSize: 15, fontWeight: '700', color: COLORS.textPrimary },
  itemVersao: { fontSize: 12, color: COLORS.textSecondary, marginTop: 2 },
  itemData: { fontSize: 11, color: COLORS.textMuted, marginTop: 4 },
  itemDireita: { alignItems: 'flex-end', gap: 8 },
  itemPreco: { ...TYPOGRAPHY.numeric, fontSize: 13, fontWeight: '700', color: COLORS.textPrimary },
  itemAcoes: { flexDirection: 'row', gap: 8 },
  iconBtn: { padding: 4 },

  vazio: { alignItems: 'center', paddingVertical: 48, paddingHorizontal: 32 },
  vazioIcone: { marginBottom: 16 },
  vazioTitulo: { fontSize: 18, fontWeight: '700', color: COLORS.textPrimary, marginBottom: 8 },
  vazioSub: { fontSize: 13, color: COLORS.textSecondary, textAlign: 'center', lineHeight: 20 },
});
