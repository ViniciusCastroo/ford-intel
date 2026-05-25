// Ficha técnica completa — seções colapsáveis, todos os campos via SpecRow
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { BadgeCategoria, BadgeFonte } from '../../components/ui/Badge';
import { SpecRow } from '../../components/ui/SpecRow';
import { COLORS } from '../../constants/colors';
import { useVehicleStore } from '../../store/vehicleStore';
import { formatarPreco } from '../../utils/format';
import { requestPermissions } from '../../services/notificationService';

// ─── Seção colapsável ─────────────────────────────────────────────────────────

function Secao({
  titulo,
  icone,
  children,
  defaultAberta = false,
}: {
  titulo: string;
  icone: string;
  children: React.ReactNode;
  defaultAberta?: boolean;
}) {
  const [aberta, setAberta] = useState(defaultAberta);

  return (
    <View style={styles.secao}>
      <TouchableOpacity
        style={styles.secaoHeader}
        onPress={() => setAberta((v) => !v)}
        activeOpacity={0.7}
      >
        <View style={styles.secaoHeaderEsquerda}>
          <Text style={styles.secaoIcone}>{icone}</Text>
          <Text style={styles.secaoTitulo}>{titulo}</Text>
        </View>
        <Ionicons
          name={aberta ? 'chevron-up' : 'chevron-down'}
          size={16}
          color={COLORS.textMuted}
        />
      </TouchableOpacity>
      {aberta && <View style={styles.secaoCorpo}>{children}</View>}
    </View>
  );
}

// ─── Barra de completude ──────────────────────────────────────────────────────

function BarraCompletude({ preenchidos, total }: { preenchidos: number; total: number }) {
  const pct = total > 0 ? preenchidos / total : 0;
  const cor = pct >= 0.8 ? COLORS.success : pct >= 0.5 ? COLORS.fordYellow : COLORS.error;

  return (
    <View style={styles.barraWrap}>
      <View style={styles.barraInfo}>
        <Text style={styles.barraLabel}>Completude dos dados</Text>
        <Text style={[styles.barraPct, { color: cor }]}>
          {preenchidos}/{total} ({Math.round(pct * 100)}%)
        </Text>
      </View>
      <View style={styles.barraBg}>
        <View style={[styles.barraFill, { width: `${pct * 100}%` as any, backgroundColor: cor }]} />
      </View>
    </View>
  );
}

// ─── Tela ─────────────────────────────────────────────────────────────────────

export default function ResultScreen() {
  const fichaAtual = useVehicleStore((s) => s.fichaAtual);
  const definirComparacao = useVehicleStore((s) => s.definirComparacao);
  const alertas = useVehicleStore((s) => s.alertas);
  const toggleAlerta = useVehicleStore((s) => s.toggleAlerta);

  const alertaAtivo = fichaAtual ? alertas.some((a) => a.fichaId === fichaAtual.id) : false;

  async function handleToggleAlerta() {
    if (!fichaAtual) return;
    const temPermissao = await requestPermissions();
    if (!temPermissao) {
      Alert.alert('Permissão negada', 'Ative as notificações nas configurações do dispositivo.');
      return;
    }
    const nomeVeiculo = `${fichaAtual.veiculo.marca} ${fichaAtual.veiculo.modelo}`;
    const preco = typeof fichaAtual.preco.fipe === 'number' ? fichaAtual.preco.fipe : null;
    await toggleAlerta(fichaAtual.id, nomeVeiculo, preco);
    if (!alertaAtivo) {
      Alert.alert('Alerta ativado', `Você será notificado sobre ${nomeVeiculo}.`);
    }
  }

  if (!fichaAtual) {
    return (
      <View style={styles.vazio}>
        <Text style={styles.vazioIcone}>🔍</Text>
        <Text style={styles.vazioTitulo}>Nenhuma ficha carregada</Text>
        <Text style={styles.vazioSub}>Realize uma busca para ver a ficha técnica.</Text>
        <TouchableOpacity style={styles.btnBuscar} onPress={() => router.push('/(tabs)/search')}>
          <Text style={styles.btnBuscarTexto}>Buscar veículo</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const { veiculo, motor, dimensoes, eficiencia, seguranca, tecnologia, preco, metadata } = fichaAtual;

  function adicionarComparacao(posicao: 0 | 1) {
    definirComparacao(posicao, fichaAtual!);
    Alert.alert('Comparação', `Veículo adicionado à posição ${posicao + 1}. Acesse a aba Comparar.`);
  }

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      {/* ── Cabeçalho ── */}
      <View style={styles.cabecalho}>
        <View style={styles.cabecalhoInfo}>
          <Text style={styles.marcaTexto}>{veiculo.marca.toUpperCase()}</Text>
          <Text style={styles.modeloTexto}>{veiculo.modelo}</Text>
          <Text style={styles.versaoTexto}>{veiculo.versao || 'Versão não especificada'}</Text>
          {veiculo.ano && <Text style={styles.anoTexto}>{veiculo.ano}</Text>}
        </View>
        <View style={styles.cabecalhoBadges}>
          <BadgeCategoria categoria={veiculo.categoria} />
          <BadgeFonte fonte={metadata.fonte} />
          {metadata.is_simulado && (
            <View style={styles.badgeSimulado}>
              <Text style={styles.badgeSimuladoTexto}>dados simulados</Text>
            </View>
          )}
        </View>
      </View>

      {/* ── Preço FIPE em destaque ── */}
      <View style={styles.precoCard}>
        <Text style={styles.precoLabel}>TABELA FIPE</Text>
        <Text style={styles.precoValor}>{formatarPreco(preco.fipe)}</Text>
        {preco.referencia && (
          <Text style={styles.precoRef}>Referência: {preco.referencia}</Text>
        )}
        {metadata.fonte !== 'fipe' && preco.fipe !== null && (
          <Text style={styles.precoSimulado}>⚠ preço simulado</Text>
        )}
        {preco.fipe === null && (
          <Text style={styles.precoSimulado}>preço indisponível na FIPE</Text>
        )}
      </View>

      {/* ── Barra de completude ── */}
      <BarraCompletude
        preenchidos={metadata.campos_preenchidos}
        total={metadata.total_campos}
      />

      {/* ── Seções técnicas ── */}
      <Secao titulo="Motor & Transmissão" icone="⚙️" defaultAberta>
        <SpecRow label="Cilindrada" valor={motor.cilindrada} />
        <SpecRow label="Tipo" valor={motor.tipo} />
        <SpecRow label="Potência" valor={motor.potencia_cv} destaque />
        <SpecRow label="Torque" valor={motor.torque_nm} destaque />
        <SpecRow label="Combustível" valor={motor.combustivel} />
        <SpecRow label="Transmissão" valor={motor.transmissao} />
        <SpecRow label="Tração" valor={motor.tracao} ultimo />
      </Secao>

      <Secao titulo="Dimensões & Capacidade" icone="📐">
        <SpecRow label="Comprimento" valor={dimensoes.comprimento_mm ? `${dimensoes.comprimento_mm} mm` : null} />
        <SpecRow label="Largura" valor={dimensoes.largura_mm ? `${dimensoes.largura_mm} mm` : null} />
        <SpecRow label="Altura" valor={dimensoes.altura_mm ? `${dimensoes.altura_mm} mm` : null} />
        <SpecRow label="Entre-eixos" valor={dimensoes.entre_eixos_mm ? `${dimensoes.entre_eixos_mm} mm` : null} />
        <SpecRow label="Altura livre do solo" valor={dimensoes.altura_livre_mm ? `${dimensoes.altura_livre_mm} mm` : null} />
        <SpecRow label="Peso bruto" valor={dimensoes.peso_kg ? `${dimensoes.peso_kg} kg` : null} />
        <SpecRow label="Carga útil" valor={dimensoes.capacidade_carga_kg ? `${dimensoes.capacidade_carga_kg} kg` : null} />
        <SpecRow label="Reboque" valor={dimensoes.capacidade_reboque_kg ? `${dimensoes.capacidade_reboque_kg} kg` : null} ultimo />
      </Secao>

      <Secao titulo="Eficiência" icone="⛽">
        <SpecRow label="Consumo cidade" valor={eficiencia.consumo_cidade} />
        <SpecRow label="Consumo estrada" valor={eficiencia.consumo_estrada} />
        <SpecRow label="Tanque" valor={eficiencia.tanque_litros ? `${eficiencia.tanque_litros} L` : null} />
        <SpecRow label="Autonomia estimada" valor={eficiencia.autonomia_km ? `${eficiencia.autonomia_km} km` : null} ultimo />
      </Secao>

      <Secao titulo="Segurança" icone="🛡️">
        <SpecRow label="Airbags" valor={seguranca.airbags} />
        <SpecRow label="ABS" valor={seguranca.abs} />
        <SpecRow label="Controle de estabilidade" valor={seguranca.controle_estabilidade} />
        <SpecRow label="Controle de tração" valor={seguranca.controle_tracao} />
        <SpecRow label="Assistente de frenagem" valor={seguranca.assistente_frenagem} ultimo />
      </Secao>

      <Secao titulo="Tecnologia" icone="📱">
        <SpecRow label="Central multimídia" valor={tecnologia.central_multimidia} />
        <SpecRow label="Conectividade" valor={tecnologia.conectividade} />
        <SpecRow label="Câmera de ré" valor={tecnologia.camera_re} />
        <SpecRow label="Sensores de estacionamento" valor={tecnologia.sensores_estacionamento} />
        <SpecRow label="Piloto automático" valor={tecnologia.piloto_automatico} ultimo />
      </Secao>

      {/* ── Ações ── */}
      <View style={styles.acoes}>
        <TouchableOpacity
          style={styles.btnAcao}
          onPress={() => adicionarComparacao(0)}
          activeOpacity={0.8}
        >
          <Ionicons name="git-compare-outline" size={16} color={COLORS.fordBlue} />
          <Text style={styles.btnAcaoTexto}>Comparar (A)</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.btnAcao}
          onPress={() => adicionarComparacao(1)}
          activeOpacity={0.8}
        >
          <Ionicons name="git-compare-outline" size={16} color={COLORS.fordBlueMid} />
          <Text style={styles.btnAcaoTexto}>Comparar (B)</Text>
        </TouchableOpacity>
      </View>

      {/* ── Alerta de preço ── */}
      <TouchableOpacity
        style={[styles.btnAlerta, alertaAtivo && styles.btnAlertaAtivo]}
        onPress={handleToggleAlerta}
        activeOpacity={0.8}
      >
        <Ionicons
          name={alertaAtivo ? 'notifications' : 'notifications-outline'}
          size={18}
          color={alertaAtivo ? COLORS.black : COLORS.fordYellow}
        />
        <Text style={[styles.btnAlertaTexto, alertaAtivo && styles.btnAlertaTextoAtivo]}>
          {alertaAtivo ? 'Alerta ativo — toque para cancelar' : 'Ativar Alerta de Preço'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: COLORS.background },
  container: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 48 },

  // Vazio
  vazio: {
    flex: 1,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  vazioIcone: { fontSize: 48, marginBottom: 16 },
  vazioTitulo: { fontSize: 18, fontWeight: '700', color: COLORS.textPrimary, marginBottom: 8, textAlign: 'center' },
  vazioSub: { fontSize: 14, color: COLORS.textSecondary, textAlign: 'center', lineHeight: 20, marginBottom: 24 },
  btnBuscar: {
    backgroundColor: COLORS.fordYellow,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  btnBuscarTexto: { fontSize: 15, fontWeight: '700', color: COLORS.black },

  // Cabeçalho
  cabecalho: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 16,
    marginBottom: 12,
  },
  cabecalhoInfo: { marginBottom: 12 },
  marcaTexto: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.fordBlueMid,
    letterSpacing: 1.5,
    marginBottom: 4,
  },
  modeloTexto: { fontSize: 22, fontWeight: '800', color: COLORS.textPrimary, marginBottom: 2 },
  versaoTexto: { fontSize: 14, color: COLORS.textSecondary, marginBottom: 2 },
  anoTexto: { fontSize: 13, color: COLORS.textMuted },
  cabecalhoBadges: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },

  // Badge simulado
  badgeSimulado: {
    backgroundColor: 'rgba(245,158,11,0.15)',
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderWidth: 1,
    borderColor: COLORS.warning,
  },
  badgeSimuladoTexto: { fontSize: 10, fontWeight: '700', color: COLORS.warning },

  // Preço
  precoCard: {
    backgroundColor: COLORS.fordBlue,
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
  },
  precoLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.6)',
    letterSpacing: 1.5,
    marginBottom: 4,
  },
  precoValor: { fontSize: 28, fontWeight: '800', color: COLORS.fordYellow },
  precoRef: { fontSize: 11, color: 'rgba(255,255,255,0.5)', marginTop: 4 },
  precoSimulado: { fontSize: 10, color: 'rgba(255,255,255,0.4)', marginTop: 6, fontStyle: 'italic' },

  // Completude
  barraWrap: {
    backgroundColor: COLORS.surface,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 14,
    marginBottom: 16,
  },
  barraInfo: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  barraLabel: { fontSize: 12, fontWeight: '600', color: COLORS.textSecondary },
  barraPct: { fontSize: 12, fontWeight: '700' },
  barraBg: {
    height: 6,
    backgroundColor: COLORS.surfaceAlt,
    borderRadius: 3,
    overflow: 'hidden',
  },
  barraFill: { height: 6, borderRadius: 3 },

  // Seções
  secao: {
    backgroundColor: COLORS.surface,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 10,
    overflow: 'hidden',
  },
  secaoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
  },
  secaoHeaderEsquerda: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  secaoIcone: { fontSize: 16 },
  secaoTitulo: { fontSize: 14, fontWeight: '700', color: COLORS.textPrimary },
  secaoCorpo: {
    paddingHorizontal: 14,
    paddingBottom: 4,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: COLORS.border,
  },

  // Ações
  acoes: { flexDirection: 'row', gap: 10, marginTop: 8 },
  btnAcao: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: COLORS.surface,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingVertical: 12,
  },
  btnAcaoTexto: { fontSize: 13, fontWeight: '600', color: COLORS.textPrimary },

  // Alerta de preço
  btnAlerta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 10,
    paddingVertical: 14,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: COLORS.fordYellow,
    backgroundColor: 'transparent',
  },
  btnAlertaAtivo: {
    backgroundColor: COLORS.fordYellow,
    borderColor: COLORS.fordYellow,
  },
  btnAlertaTexto: { fontSize: 14, fontWeight: '700', color: COLORS.fordYellow },
  btnAlertaTextoAtivo: { color: COLORS.black },
});
