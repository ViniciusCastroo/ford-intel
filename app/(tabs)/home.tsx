import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { FlatList, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import type { IoniconName } from '../../components/ui/icon';
import { COLORS, RADIUS, TYPOGRAPHY } from '../../constants/colors';
import { useAuthStore } from '../../store/authStore';
import { useVehicleStore } from '../../store/vehicleStore';
import { formatarPreco } from '../../utils/format';
import type { BuscaSalva } from '../../types/vehicle';

function KpiCard({ icone, valor, label }: {
  icone: IoniconName; valor: number; label: string;
}) {
  return (
    <View style={styles.kpiCard}>
      <Ionicons name={icone} size={20} color={COLORS.brandLight} style={styles.kpiIcone} />
      <Text style={styles.kpiValor}>{valor}</Text>
      <Text style={styles.kpiLabel}>{label}</Text>
    </View>
  );
}

function ItemRecente({ item, onPress }: { item: BuscaSalva; onPress: () => void }) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8} style={styles.itemRecente}>
      <View style={styles.itemRecenteTop}>
        <Text style={styles.itemMarca}>{item.ficha.veiculo.marca}</Text>
        {item.favorito && <Ionicons name="star" size={12} color={COLORS.accent} />}
      </View>
      <Text style={styles.itemModelo} numberOfLines={1}>{item.ficha.veiculo.modelo}</Text>
      <Text style={styles.itemPreco}>{formatarPreco(item.ficha.preco.fipe)}</Text>
    </TouchableOpacity>
  );
}

export default function HomeScreen() {
  const usuario = useAuthStore((s) => s.usuario);
  const fichas = useVehicleStore((s) => s.fichas);
  const setFichaAtual = useVehicleStore((s) => s.setFichaAtual);

  const recentes = fichas.slice(0, 10);
  const favoritos = fichas.filter((f) => f.favorito);
  const comparacoes = useVehicleStore((s) => s.comparacao).filter(Boolean).length;

  const primeiroNome = usuario?.nome.split(' ')[0] ?? 'Consultor';
  const dataHoje = new Date().toLocaleDateString('pt-BR', {
    weekday: 'long', day: 'numeric', month: 'long',
  });

  function abrirFicha(item: BuscaSalva) {
    setFichaAtual(item.ficha);
    router.push('/(tabs)/result');
  }

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.hero}>
        <View style={styles.heroTexto}>
          <Text style={styles.ola}>Olá, {primeiroNome}</Text>
          <Text style={styles.data}>{dataHoje}</Text>
        </View>
      </View>

      <View style={styles.kpisRow}>
        <KpiCard icone="document-text-outline" valor={fichas.length} label="Fichas" />
        <KpiCard icone="star-outline" valor={favoritos.length} label="Favoritos" />
        <KpiCard icone="git-compare-outline" valor={comparacoes} label="Comparações" />
      </View>

      <TouchableOpacity
        style={styles.ctaBusca}
        activeOpacity={0.85}
        onPress={() => router.push('/(tabs)/search')}
      >
        <View style={styles.ctaEsquerda}>
          <Ionicons name="search" size={22} color={COLORS.onAccent} />
          <View>
            <Text style={styles.ctaTitulo}>Nova Busca</Text>
            <Text style={styles.ctaSub}>Marca · Modelo · Versão</Text>
          </View>
        </View>
        <Ionicons name="arrow-forward" size={20} color={COLORS.onAccent} />
      </TouchableOpacity>

      <Text style={styles.secaoTitulo}>Recentes</Text>

      {recentes.length === 0 ? (
        <View style={styles.vazio}>
          <Ionicons name="car-sport-outline" size={40} color={COLORS.textMuted} style={styles.vazioIcone} />
          <Text style={styles.vazioCabecalho}>Nenhuma busca ainda</Text>
          <Text style={styles.vazioSub}>Busque um veículo concorrente para começar.</Text>
        </View>
      ) : (
        <FlatList
          data={recentes}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.listaHorizontal}
          renderItem={({ item }) => (
            <ItemRecente item={item} onPress={() => abrirFicha(item)} />
          )}
        />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: COLORS.bg },
  container: { paddingHorizontal: 20, paddingTop: 24, paddingBottom: 48 },

  hero: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  heroTexto: { flex: 1 },
  ola: { fontSize: 24, fontWeight: '700', color: COLORS.textPrimary, marginBottom: 2 },
  data: { fontSize: 13, color: COLORS.textSecondary },

  kpisRow: { flexDirection: 'row', gap: 10, marginBottom: 20 },
  kpiCard: {
    flex: 1, backgroundColor: COLORS.surface, borderRadius: RADIUS.md,
    paddingVertical: 16, paddingHorizontal: 12, alignItems: 'center',
  },
  kpiIcone: { marginBottom: 8 },
  kpiValor: { fontSize: 32, fontWeight: '800', color: COLORS.textPrimary, marginBottom: 2 },
  kpiLabel: { fontSize: 11, color: COLORS.textSecondary, fontWeight: '600' },

  ctaBusca: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: COLORS.accent, borderRadius: RADIUS.lg, padding: 18, marginBottom: 28,
  },
  ctaEsquerda: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  ctaTitulo: { fontSize: 16, fontWeight: '700', color: COLORS.onAccent },
  ctaSub: { fontSize: 12, color: COLORS.onAccentMuted, marginTop: 1 },

  secaoTitulo: {
    fontSize: 12, fontWeight: '700', color: COLORS.textSecondary,
    letterSpacing: 1, textTransform: 'uppercase', marginBottom: 12,
  },

  listaHorizontal: { gap: 12, paddingRight: 4 },
  itemRecente: {
    width: 160, backgroundColor: COLORS.surface, borderRadius: RADIUS.md, padding: 14,
  },
  itemRecenteTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  itemMarca: { fontSize: 11, fontWeight: '600', color: COLORS.textMuted, letterSpacing: 0.5 },
  itemModelo: { fontSize: 14, fontWeight: '700', color: COLORS.textPrimary, marginBottom: 8 },
  itemPreco: { ...TYPOGRAPHY.numeric, fontSize: 13, fontWeight: '700', color: COLORS.textPrimary },

  vazio: {
    backgroundColor: COLORS.surface, borderRadius: RADIUS.md, padding: 32, alignItems: 'center',
  },
  vazioIcone: { marginBottom: 12 },
  vazioCabecalho: { fontSize: 15, fontWeight: '600', color: COLORS.textPrimary, marginBottom: 8 },
  vazioSub: { fontSize: 13, color: COLORS.textSecondary, textAlign: 'center', lineHeight: 20 },
});
