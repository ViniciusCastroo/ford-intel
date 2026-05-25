// Valor de especificação técnica — null = "Não disponível" na UI
export type SpecValue = string | number | null;

// Categoria do veículo
export type VehicleCategory = 'pickup' | 'suv' | 'sedan' | 'hatch' | 'outro';

// Ficha técnica padronizada — SEMPRE o mesmo formato
export interface TechSpecSheet {
  id: string;
  createdAt: string;

  veiculo: {
    marca: string;
    modelo: string;
    versao: string;
    ano: number | null;
    categoria: VehicleCategory;
  };

  motor: {
    cilindrada: SpecValue;
    tipo: SpecValue;
    potencia_cv: SpecValue;
    torque_nm: SpecValue;
    combustivel: SpecValue;
    transmissao: SpecValue;
    tracao: SpecValue;
  };

  dimensoes: {
    comprimento_mm: SpecValue;
    largura_mm: SpecValue;
    altura_mm: SpecValue;
    entre_eixos_mm: SpecValue;
    altura_livre_mm: SpecValue;
    peso_kg: SpecValue;
    capacidade_carga_kg: SpecValue;
    capacidade_reboque_kg: SpecValue;
  };

  eficiencia: {
    consumo_cidade: SpecValue;
    consumo_estrada: SpecValue;
    tanque_litros: SpecValue;
    autonomia_km: SpecValue;
  };

  seguranca: {
    airbags: SpecValue;
    abs: SpecValue;
    controle_estabilidade: SpecValue;
    controle_tracao: SpecValue;
    assistente_frenagem: SpecValue;
  };

  tecnologia: {
    central_multimidia: SpecValue;
    conectividade: SpecValue;
    camera_re: SpecValue;
    sensores_estacionamento: SpecValue;
    piloto_automatico: SpecValue;
  };

  preco: {
    fipe: SpecValue;
    referencia: SpecValue;
  };

  metadata: {
    fonte: 'fipe' | 'mock' | 'manual';
    campos_preenchidos: number;
    total_campos: number;
    is_simulado: boolean;
  };
}

// Input do usuário na busca
export interface BuscaVeiculo {
  marca: string;
  modelo: string;
  versao: string;
  ano?: number;
}

// Registro salvo no histórico
export interface BuscaSalva {
  id: string;
  input: BuscaVeiculo;
  ficha: TechSpecSheet;
  salvoEm: string;
  favorito: boolean;
}

// Alerta de preço ativo para um veículo
export interface AlertaPreco {
  fichaId: string;
  notificationId: string;
  veiculo: string;
  preco: number | null;
  criadoEm: string;
}
