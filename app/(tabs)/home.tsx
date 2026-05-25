// Dashboard principal — saudação, KPIs, recentes e CTA de busca
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { FlatList, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { COLORS } from '../../constants/colors';
import { useAuthStore } from '../../store/authStore';
import { useVehicleStore } from '../../store/vehicleStore';
import { formatarPreco } from '../../utils/format';
import type { BuscaSalva } from '../../types/vehicle';

// ─── Card de KPI ─────────────────────────────────────────────────────────────

function KpiCard({ icone, valor, label, cor }: {
  icone: string; valor: number; label: string; cor: string;
}) {
  return (
    <View style={[styles.kpiCard, { borderTopColor: cor, borderTopWidth: 3 }]}>
      <Text style={styles.kpiIcone}>{icone}</Text>
      <Text style={[styles.kpiValor, { color: cor }]}>{valor}</Text>
      <Text style={styles.kpiLabel}>{label}</Text>
    </View>
  );
}

// ─── Item de busca recente (horizontal) ──────────────────────────────────────

function ItemRecente({ item, onPress }: { item: BuscaSalva; onPress: () => void }) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8} style={styles.itemRecente}>
      <View style={styles.itemRecenteTop}>
        <Text style={styles.itemMarca}>{item.ficha.veiculo.marca}</Text>
        {item.favorito && <Ionicons name="star" size={12} color={COLORS.fordYellow} />}
      </View>
      <Text style={styles.itemModelo} numberOfLines={1}>{item.ficha.veiculo.modelo}</Text>
      <Text style={styles.itemPreco}>{formatarPreco(item.ficha.preco.fipe)}</Text>
    </TouchableOpacity>
  );
}

// ─── Tela ─────────────────────────────────────────────────────────────────────

export default function HomeScreen() {
  const usuario = useAuthStore((s) => s.usuario);
  // Acessa o array estável — slice/filter local para evitar re-render infinito
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
      {/* Saudação */}
      <View style={styles.hero}>
        <View style={styles.heroTexto}>
          <Text style={styles.ola}>Olá, {primeiroNome} 👋</Text>
          <Text style={styles.data}>{dataHoje}</Text>
        </View>
        <View style={styles.fordBadge}>
          <Text style={styles.fordBadgeTexto}>F</Text>
        </View>
      </View>

      {/* KPIs */}
      <View style={styles.kpisRow}>
        <KpiCard icone="📋" valor={fichas.length} label="Fichas" cor={COLORS.fordYellow} />
        <KpiCard icone="⭐" valor={favoritos.length} label="Favoritos" cor={COLORS.success} />
        <KpiCard icone="⚖️" valor={comparacoes} label="Comparações" cor={COLORS.fordBlueMid} />
      </View>

      {/* CTA Nova Busca */}
      <TouchableOpacity
        style={styles.ctaBusca}
        activeOpacity={0.85}
        onPress={() => router.push('/(tabs)/search')}
      >
        <View style={styles.ctaEsquerda}>
          <Ionicons name="search" size={22} color={COLORS.black} />
          <View>
            <Text style={styles.ctaTitulo}>Nova Busca</Text>
            <Text style={styles.ctaSub}>Marca · Modelo · Versão</Text>
          </View>
        </View>
        <Ionicons name="arrow-forward" size={20} color={COLORS.black} />
      </TouchableOpacity>

      {/* Buscas recentes — FlatList horizontal */}
      <Text style={styles.secaoTitulo}>Recentes</Text>

      {recentes.length === 0 ? (
        <View style={styles.vazio}>
          <Text style={styles.vazioCabecalho}>🚗  Nenhuma busca ainda</Text>
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
  scroll: { flex: 1, backgroundColor: COLORS.background },
  container: { paddingHorizontal: 20, paddingTop: 24, paddingBottom: 48 },

  // Hero
  hero: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  heroTexto: { flex: 1 },
  ola: { fontSize: 24, fontWeight: '700', color: COLORS.textPrimary, marginBottom: 2 },
  data: { fontSize: 13, color: COLORS.textSecondary },
  fordBadge: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: COLORS.fordBlue, alignItems: 'center', justifyContent: 'center',
  },
  fordBadgeTexto: { fontSize: 20, fontWeight: '800', color: COLORS.white },

  // KPIs
  kpisRow: { flexDirection: 'row', gap: 10, marginBottom: 20 },
  kpiCard: {
    flex: 1, backgroundColor: COLORS.surface, borderRadius: 10,
    borderWidth: 1, borderColor: COLORS.border, padding: 12, alignItems: 'center',
    elevation: 2,
  },
  kpiIcone: { fontSize: 20, marginBottom: 4 },
  kpiValor: { fontSize: 22, fontWeight: '700', marginBottom: 2 },
  kpiLabel: { fontSize: 11, color: COLORS.textMuted, fontWeight: '600' },

  // CTA Busca
  ctaBusca: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: COLORS.fordYellow, borderRadius: 12, padding: 16, marginBottom: 28,
  },
  ctaEsquerda: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  ctaTitulo: { fontSize: 16, fontWeight: '700', color: COLORS.black },
  ctaSub: { fontSize: 12, color: 'rgba(0,0,0,0.6)', marginTop: 1 },

  // Seção
  secaoTitulo: {
    fontSize: 12, fontWeight: '700', color: COLORS.textSecondary,
    letterSpacing: 1, textTransform: 'uppercase', marginBottom: 12,
  },

  // Lista horizontal
  listaHorizontal: { gap: 12, paddingRight: 4 },
  itemRecente: {
    width: 160, backgroundColor: COLORS.surface, borderRadius: 10,
    borderWidth: 1, borderColor: COLORS.border, padding: 14,
  },
  itemRecenteTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  itemMarca: { fontSize: 11, fontWeight: '600', color: COLORS.textMuted, letterSpacing: 0.5 },
  itemModelo: { fontSize: 14, fontWeight: '700', color: COLORS.textPrimary, marginBottom: 8 },
  itemPreco: { fontSize: 13, fontWeight: '700', color: COLORS.fordYellow },

  // Estado vazio
  vazio: {
    backgroundColor: COLORS.surface, borderRadius: 10, borderWidth: 1,
    borderColor: COLORS.border, padding: 32, alignItems: 'center',
  },
  vazioCabecalho: { fontSize: 15, fontWeight: '600', color: COLORS.textPrimary, marginBottom: 8 },
  vazioSub: { fontSize: 13, color: COLORS.textSecondary, textAlign: 'center', lineHeight: 20 },
});
