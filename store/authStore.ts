import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';

const CREDENCIAIS_MOCK: Record<string, { nome: string; cargo: string }> = {
  'analista@ford.com:ford2026': { nome: 'Ana Lima', cargo: 'Analista de Produto' },
};

interface Usuario {
  nome: string;
  cargo: string;
  email: string;
}

interface AuthState {
  token: string | null;
  usuario: Usuario | null;
  carregando: boolean;
  erro: string | null;

  login: (email: string, senha: string) => Promise<void>;
  logout: () => Promise<void>;
  restaurarSessao: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  usuario: null,
  carregando: true,
  erro: null,

  login: async (email, senha) => {
    set({ carregando: true, erro: null });

    const chave = `${email.toLowerCase().trim()}:${senha}`;
    const dados = CREDENCIAIS_MOCK[chave];

    if (!dados) {
      set({ carregando: false, erro: 'E-mail ou senha inválidos.' });
      throw new Error('E-mail ou senha inválidos.');
    }

    const token = `mock-token-${Date.now()}`;
    const usuario: Usuario = { ...dados, email: email.toLowerCase().trim() };

    await AsyncStorage.setItem('ford_token', token);
    await AsyncStorage.setItem('ford_usuario', JSON.stringify(usuario));

    set({ token, usuario, carregando: false, erro: null });
  },

  logout: async () => {
    await AsyncStorage.multiRemove(['ford_token', 'ford_usuario']);
    set({ token: null, usuario: null });
  },

  restaurarSessao: async () => {
    set({ carregando: true });
    const token = await AsyncStorage.getItem('ford_token');
    const usuarioStr = await AsyncStorage.getItem('ford_usuario');

    if (token && usuarioStr) {
      set({ token, usuario: JSON.parse(usuarioStr), carregando: false });
    } else {
      set({ carregando: false });
    }
  },
}));
