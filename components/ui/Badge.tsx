// Badge de categoria e confiança do veículo
import { StyleSheet, Text, View, ViewStyle } from 'react-native';
import { COLORS } from '../../constants/colors';
import type { VehicleCategory } from '../../types/vehicle';

// ─── Badge de categoria ───────────────────────────────────────────────────────

interface BadgeCategoriaProps {
  categoria: VehicleCategory;
  estilo?: ViewStyle;
}

const COR_CATEGORIA: Record<VehicleCategory, string> = {
  pickup: COLORS.fordBlueMid,
  suv: '#16A34A',
  sedan: '#7C3AED',
  hatch: '#0891B2',
  outro: COLORS.textMuted,
};

export function BadgeCategoria({ categoria, estilo }: BadgeCategoriaProps) {
  return (
    <View style={[styles.badge, { backgroundColor: COR_CATEGORIA[categoria] }, estilo]}>
      <Text style={styles.texto}>{categoria.toUpperCase()}</Text>
    </View>
  );
}

// ─── Badge de fonte dos dados ─────────────────────────────────────────────────

interface BadgeFonteProps {
  fonte: 'fipe' | 'mock' | 'manual';
}

const COR_FONTE: Record<'fipe' | 'mock' | 'manual', string> = {
  fipe: COLORS.success,
  mock: COLORS.fordBlueMid,
  manual: COLORS.warning,
};

const LABEL_FONTE: Record<'fipe' | 'mock' | 'manual', string> = {
  fipe: 'FIPE',
  mock: 'SIMULADO',
  manual: 'MANUAL',
};

export function BadgeFonte({ fonte }: BadgeFonteProps) {
  return (
    <View style={[styles.badge, { backgroundColor: COR_FONTE[fonte] }]}>
      <Text style={styles.texto}>{LABEL_FONTE[fonte]}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  texto: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.white,
    letterSpacing: 0.8,
  },
});
