// Linha de dado técnico — núcleo visual da ficha padronizada
// REGRA: valor null → sempre "Não disponível" em cinza via formatarValor()

import { StyleSheet, Text, View } from 'react-native';
import { COLORS } from '../../constants/colors';
import { formatarValor } from '../../utils/format';
import type { SpecValue } from '../../types/vehicle';

interface SpecRowProps {
  label: string;
  valor: SpecValue;
  destaque?: boolean;  // amarelo Ford para campos importantes
  ultimo?: boolean;    // omite linha divisória no último item da seção
}

export function SpecRow({ label, valor, destaque = false, ultimo = false }: SpecRowProps) {
  const valorFormatado = formatarValor(valor);
  const isNaoDisponivel = valor === null || valor === undefined || valor === '';

  return (
    <View style={[styles.row, !ultimo && styles.divisor]}>
      <Text style={styles.label}>{label}</Text>
      <Text
        style={[
          styles.valor,
          isNaoDisponivel && styles.valorNulo,
          destaque && styles.valorDestaque,
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
    borderBottomColor: COLORS.border,
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
    fontFamily: 'monospace',
    fontWeight: '500',
    color: COLORS.textPrimary,
    textAlign: 'right',
    lineHeight: 18,
  },
  valorNulo: {
    color: COLORS.textMuted,
    fontStyle: 'italic',
    fontFamily: undefined,
    fontSize: 12,
  },
  valorDestaque: {
    color: COLORS.fordYellow,
    fontWeight: '700',
  },
});
