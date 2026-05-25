import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export async function requestPermissions(): Promise<boolean> {
  if (Platform.OS === 'web') return false;
  const { status: existing } = await Notifications.getPermissionsAsync();
  if (existing === 'granted') return true;
  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted';
}

export async function scheduleVehicleAlert(
  veiculo: string,
  preco: number | null,
): Promise<string> {
  const precoTexto = preco
    ? preco.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 })
    : 'preço indisponível';

  const id = await Notifications.scheduleNotificationAsync({
    content: {
      title: `Alerta: ${veiculo}`,
      body: `Ficha técnica salva — Tabela FIPE: ${precoTexto}`,
      data: { veiculo, preco },
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds: 2,
    },
  });

  return id;
}

export async function cancelAlert(id: string): Promise<void> {
  await Notifications.cancelScheduledNotificationAsync(id);
}
