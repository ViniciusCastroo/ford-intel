import { StyleSheet, Text, View, ViewStyle } from 'react-native';
import { COLORS, RADIUS } from '../../constants/colors';
import type { VehicleCategory } from '../../types/vehicle';

interface BadgeCategoriaProps {
  categoria: VehicleCategory;
  estilo?: ViewStyle;
}

const COR_CATEGORIA: Record<VehicleCategory, string> = COLORS.category;

export function BadgeCategoria({ categoria, estilo }: BadgeCategoriaProps) {
  return (
    <View style={[styles.badge, { backgroundColor: COR_CATEGORIA[categoria] }, estilo]}>
      <Text style={styles.texto}>{categoria.toUpperCase()}</Text>
    </View>
  );
}

interface BadgeFonteProps {
  fonte: 'fipe' | 'mock' | 'manual';
}

const COR_FONTE: Record<'fipe' | 'mock' | 'manual', string> = {
  fipe: COLORS.success,
  mock: COLORS.brandMid,
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
    borderRadius: RADIUS.xs,
    alignSelf: 'flex-start',
  },
  texto: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.white,
    letterSpacing: 0.8,
  },
});
