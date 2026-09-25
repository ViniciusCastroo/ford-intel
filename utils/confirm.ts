import { Alert, Platform } from 'react-native';

export function confirmar(
  titulo: string,
  mensagem: string,
  rotuloConfirmar: string,
  aoConfirmar: () => void,
  destrutivo = false,
): void {
  if (Platform.OS === 'web') {
    if (window.confirm(`${titulo}\n\n${mensagem}`)) aoConfirmar();
    return;
  }

  Alert.alert(titulo, mensagem, [
    { text: 'Cancelar', style: 'cancel' },
    { text: rotuloConfirmar, style: destrutivo ? 'destructive' : 'default', onPress: aoConfirmar },
  ]);
}
