import { StyleSheet, Text, View } from 'react-native';
import { COLORS, TYPOGRAPHY } from '../../constants/colors';
import { formatarValor } from '../../utils/format';
import type { SpecValue } from '../../types/vehicle';

interface SpecRowProps {
  label: string;
  valor: SpecValue;
  destaque?: boolean;
  ultimo?: boolean;
}

export function SpecRow({ label, valor, destaque = false, ultimo = false }: SpecRowProps) {
  const valorFormatado = formatarValor(valor);
  const isNaoDisponivel = valor === null || valor === undefined || valor === '';
  const isNumerico =
    typeof valor === 'number' ||
    (typeof valor === 'string' && /^\d[\d.,]*\s?(mm|kg|km\/l|km|cv|nm|l)?$/i.test(valor.trim()));

  return (
    <View style={[styles.row, !ultimo && styles.divisor]}>
      <Text style={styles.label}>{label}</Text>
      <Text
        style={[
          styles.valor,
          isNumerico && TYPOGRAPHY.numeric,
          isNaoDisponivel && styles.valorNulo,
          destaque && !isNaoDisponivel && styles.valorDestaque,
        ]}
        numberOfLines={2}
      >
        {valorFormatado}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: 10,
    gap: 12,
  },
  divisor: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: COLORS.divider,
  },
  label: {
    flex: 1,
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textSecondary,
    letterSpacing: 0.3,
    lineHeight: 18,
  },
  valor: {
    flex: 1.2,
    fontSize: 13,
    fontWeight: '500',
    color: COLORS.textPrimary,
    textAlign: 'right',
    lineHeight: 18,
  },
  valorNulo: {
    color: COLORS.textMuted,
    fontStyle: 'italic',
    fontSize: 12,
    paddingRight: 2,
  },
  valorDestaque: {
    fontSize: 15,
    fontWeight: '700',
  },
});
