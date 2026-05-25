// Store de fichas — Zustand + AsyncStorage manual
import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import * as notificationService from '../services/notificationService';
import type { AlertaPreco, BuscaSalva, BuscaVeiculo, TechSpecSheet } from '../types/vehicle';

const STORAGE_KEY = 'ford_fichas';
const ALERTAS_KEY = 'ford_alertas';

interface VehicleState {
  fichas: BuscaSalva[];
  comparacao: [TechSpecSheet | null, TechSpecSheet | null];
  fichaAtual: TechSpecSheet | null;
  alertas: AlertaPreco[];

  setFichaAtual: (ficha: TechSpecSheet) => void;
  salvarFicha: (ficha: TechSpecSheet, input: BuscaVeiculo) => Promise<void>;
  removerFicha: (id: string) => Promise<void>;
  toggleFavorito: (id: string) => void;
  definirComparacao: (posicao: 0 | 1, ficha: TechSpecSheet) => void;
  carregarDoStorage: () => Promise<void>;
  toggleAlerta: (fichaId: string, veiculo: string, preco: number | null) => Promise<void>;
}

export const useVehicleStore = create<VehicleState>((set, get) => ({
  fichas: [],
  comparacao: [null, null],
  fichaAtual: null,
  alertas: [],

  // Define a ficha atual para exibição na tela de resultado
  setFichaAtual: (ficha) => set({ fichaAtual: ficha }),

  // Salva no histórico e persiste no AsyncStorage
  salvarFicha: async (ficha, input) => {
    const nova: BuscaSalva = {
      id: `${Date.now()}`,
      input,
      ficha,
      salvoEm: new Date().toISOString(),
      favorito: false,
    };
    // Mantém no máximo 50 fichas, mais recente primeiro
    const novasFichas = [nova, ...get().fichas].slice(0, 50);
    set({ fichas: novasFichas });
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(novasFichas));
  },

  // Remove do histórico e atualiza AsyncStorage
  removerFicha: async (id) => {
    const fichas = get().fichas.filter((f) => f.id !== id);
    set({ fichas });
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(fichas));
  },

  // Alterna favorito — persiste em background
  toggleFavorito: (id) => {
    const fichas = get().fichas.map((f) =>
      f.id === id ? { ...f, favorito: !f.favorito } : f,
    );
    set({ fichas });
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(fichas));
  },

  // Define uma das posições de comparação (0 = esquerda, 1 = direita)
  definirComparacao: (posicao, ficha) => {
    const comparacao = [...get().comparacao] as [TechSpecSheet | null, TechSpecSheet | null];
    comparacao[posicao] = ficha;
    set({ comparacao });
  },

  // Carrega histórico e alertas salvos ao iniciar o app
  carregarDoStorage: async () => {
    const [fichasJson, alertasJson] = await Promise.all([
      AsyncStorage.getItem(STORAGE_KEY),
      AsyncStorage.getItem(ALERTAS_KEY),
    ]);
    if (fichasJson) set({ fichas: JSON.parse(fichasJson) as BuscaSalva[] });
    if (alertasJson) set({ alertas: JSON.parse(alertasJson) as AlertaPreco[] });
  },

  // Ativa ou cancela alerta de preço para uma ficha
  toggleAlerta: async (fichaId, veiculo, preco) => {
    const alertas = get().alertas;
    const existente = alertas.find((a) => a.fichaId === fichaId);

    if (existente) {
      await notificationService.cancelAlert(existente.notificationId);
      const novos = alertas.filter((a) => a.fichaId !== fichaId);
      set({ alertas: novos });
      await AsyncStorage.setItem(ALERTAS_KEY, JSON.stringify(novos));
    } else {
      const notificationId = await notificationService.scheduleVehicleAlert(veiculo, preco);
      const novo: AlertaPreco = {
        fichaId,
        notificationId,
        veiculo,
        preco,
        criadoEm: new Date().toISOString(),
      };
      const novos = [...alertas, novo];
      set({ alertas: novos });
      await AsyncStorage.setItem(ALERTAS_KEY, JSON.stringify(novos));
    }
  },
}));
