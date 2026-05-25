import type { TechSpecSheet } from '../types/vehicle';

// ─── Ford Ranger Raptor 2024 — veículo de validação obrigatória ───────────────

export const RANGER_RAPTOR: TechSpecSheet = {
  id: 'ford-ranger-raptor-2024',
  createdAt: new Date().toISOString(),
  veiculo: { marca: 'Ford', modelo: 'Ranger Raptor', versao: '2.3 EcoBoost 4x4 AT', ano: 2024, categoria: 'pickup' },
  motor: { cilindrada: '2.3L', tipo: 'EcoBoost Turbo 4 cilindros', potencia_cv: 288, torque_nm: 440, combustivel: 'Gasolina', transmissao: 'Automático 10 velocidades', tracao: '4x4' },
  dimensoes: { comprimento_mm: 5362, largura_mm: 2028, altura_mm: 1873, entre_eixos_mm: 3230, altura_livre_mm: 283, peso_kg: 2151, capacidade_carga_kg: 650, capacidade_reboque_kg: 2500 },
  eficiencia: { consumo_cidade: '8.5 km/l', consumo_estrada: '9.8 km/l', tanque_litros: 80, autonomia_km: 784 },
  seguranca: { airbags: '7 airbags', abs: 'Sim', controle_estabilidade: 'Sim (ESP)', controle_tracao: 'Sim', assistente_frenagem: 'Sim' },
  tecnologia: { central_multimidia: 'Ford SYNC 4A - 12 polegadas', conectividade: 'Android Auto, Apple CarPlay, Bluetooth, Wi-Fi', camera_re: 'Câmera traseira + 360°', sensores_estacionamento: 'Dianteiros e traseiros', piloto_automatico: 'Adaptativo (ACC)' },
  preco: { fipe: 340000, referencia: 'Abril/2026' },
  metadata: { fonte: 'mock', campos_preenchidos: 28, total_campos: 28, is_simulado: false },
};

// ─── Toyota Hilux GR Sport 2024 ───────────────────────────────────────────────

export const HILUX_GR_SPORT: TechSpecSheet = {
  id: 'toyota-hilux-gr-sport-2024',
  createdAt: new Date().toISOString(),
  veiculo: { marca: 'Toyota', modelo: 'Hilux GR Sport', versao: '2.8 Diesel 4x4 AT', ano: 2024, categoria: 'pickup' },
  motor: { cilindrada: '2.8L', tipo: '1GD-FTV Diesel Turbo', potencia_cv: 204, torque_nm: 500, combustivel: 'Diesel', transmissao: 'Automático 6 velocidades', tracao: '4x4' },
  dimensoes: { comprimento_mm: 5325, largura_mm: 1855, altura_mm: 1815, entre_eixos_mm: 3085, altura_livre_mm: 228, peso_kg: 2110, capacidade_carga_kg: 1175, capacidade_reboque_kg: 3500 },
  eficiencia: { consumo_cidade: '10.2 km/l', consumo_estrada: '12.5 km/l', tanque_litros: 80, autonomia_km: 1000 },
  seguranca: { airbags: '7 airbags', abs: 'Sim', controle_estabilidade: 'Sim (VSC)', controle_tracao: 'Sim (A-TRC)', assistente_frenagem: 'Sim' },
  tecnologia: { central_multimidia: 'Toyota Multimedia - 9 polegadas', conectividade: 'Android Auto, Apple CarPlay, Bluetooth', camera_re: 'Câmera traseira + sensores', sensores_estacionamento: 'Traseiros', piloto_automatico: 'Adaptativo (ACC)' },
  preco: { fipe: 322000, referencia: 'Abril/2026' },
  metadata: { fonte: 'mock', campos_preenchidos: 28, total_campos: 28, is_simulado: false },
};

// ─── Volkswagen Amarok Aventura V6 2024 ───────────────────────────────────────

export const AMAROK_V6: TechSpecSheet = {
  id: 'vw-amarok-v6-2024',
  createdAt: new Date().toISOString(),
  veiculo: { marca: 'Volkswagen', modelo: 'Amarok V6', versao: 'Aventura 3.0 TDI 4Motion AT', ano: 2024, categoria: 'pickup' },
  motor: { cilindrada: '3.0L', tipo: 'TDI V6 Turbo Diesel', potencia_cv: 258, torque_nm: 580, combustivel: 'Diesel', transmissao: 'Automático 8 velocidades', tracao: '4x4 4Motion' },
  dimensoes: { comprimento_mm: 5350, largura_mm: 1954, altura_mm: 1840, entre_eixos_mm: 3098, altura_livre_mm: 240, peso_kg: 2200, capacidade_carga_kg: 1100, capacidade_reboque_kg: 3500 },
  eficiencia: { consumo_cidade: '9.0 km/l', consumo_estrada: '12.0 km/l', tanque_litros: 80, autonomia_km: 960 },
  seguranca: { airbags: '8 airbags', abs: 'Sim', controle_estabilidade: 'Sim (ESC)', controle_tracao: 'Sim (ASR)', assistente_frenagem: 'Sim (FrontAssist)' },
  tecnologia: { central_multimidia: 'Discover Pro - 10 polegadas', conectividade: 'Android Auto, Apple CarPlay, Bluetooth, Wi-Fi', camera_re: 'Câmera 360° Area View', sensores_estacionamento: 'Dianteiros e traseiros', piloto_automatico: 'Adaptativo com ACC e Stop&Go' },
  preco: { fipe: 430000, referencia: 'Abril/2026' },
  metadata: { fonte: 'mock', campos_preenchidos: 28, total_campos: 28, is_simulado: false },
};

// ─── Mitsubishi L200 Triton Sport HPE 2024 ───────────────────────────────────

export const L200_TRITON: TechSpecSheet = {
  id: 'mitsubishi-l200-triton-2024',
  createdAt: new Date().toISOString(),
  veiculo: { marca: 'Mitsubishi', modelo: 'L200 Triton Sport', versao: 'HPE 2.4 Diesel 4x4 AT', ano: 2024, categoria: 'pickup' },
  motor: { cilindrada: '2.4L', tipo: 'MIVEC Diesel Turbo', potencia_cv: 190, torque_nm: 430, combustivel: 'Diesel', transmissao: 'Automático 6 velocidades', tracao: '4x4' },
  dimensoes: { comprimento_mm: 5295, largura_mm: 1815, altura_mm: 1780, entre_eixos_mm: 3000, altura_livre_mm: 205, peso_kg: 2040, capacidade_carga_kg: 1100, capacidade_reboque_kg: 3100 },
  eficiencia: { consumo_cidade: '10.5 km/l', consumo_estrada: '13.0 km/l', tanque_litros: 75, autonomia_km: 975 },
  seguranca: { airbags: '7 airbags', abs: 'Sim', controle_estabilidade: 'Sim', controle_tracao: 'Sim', assistente_frenagem: 'Sim' },
  tecnologia: { central_multimidia: '9 polegadas com GPS', conectividade: 'Android Auto, Apple CarPlay, Bluetooth', camera_re: 'Câmera traseira 360°', sensores_estacionamento: 'Dianteiros e traseiros', piloto_automatico: 'Adaptativo' },
  preco: { fipe: 263000, referencia: 'Abril/2026' },
  metadata: { fonte: 'mock', campos_preenchidos: 28, total_campos: 28, is_simulado: false },
};

// ─── Chevrolet S10 High Country 2024 ─────────────────────────────────────────

export const S10_HIGH_COUNTRY: TechSpecSheet = {
  id: 'chevrolet-s10-high-country-2024',
  createdAt: new Date().toISOString(),
  veiculo: { marca: 'Chevrolet', modelo: 'S10 High Country', versao: '2.8 Diesel 4x4 AT', ano: 2024, categoria: 'pickup' },
  motor: { cilindrada: '2.8L', tipo: 'Duramax Diesel Turbo', potencia_cv: 200, torque_nm: 500, combustivel: 'Diesel', transmissao: 'Automático 6 velocidades', tracao: '4x4' },
  dimensoes: { comprimento_mm: 5270, largura_mm: 1855, altura_mm: 1780, entre_eixos_mm: 3100, altura_livre_mm: 220, peso_kg: 2070, capacidade_carga_kg: 1100, capacidade_reboque_kg: 3500 },
  eficiencia: { consumo_cidade: '9.8 km/l', consumo_estrada: '12.3 km/l', tanque_litros: 76, autonomia_km: 934 },
  seguranca: { airbags: '6 airbags', abs: 'Sim', controle_estabilidade: 'Sim (StabiliTrak)', controle_tracao: 'Sim', assistente_frenagem: 'Sim' },
  tecnologia: { central_multimidia: 'Chevrolet MyLink - 8 polegadas', conectividade: 'Android Auto, Apple CarPlay, Bluetooth', camera_re: 'Câmera traseira', sensores_estacionamento: 'Traseiros', piloto_automatico: 'Convencional' },
  preco: { fipe: 280000, referencia: 'Abril/2026' },
  metadata: { fonte: 'mock', campos_preenchidos: 28, total_campos: 28, is_simulado: false },
};

// ─── RAM 1500 Laramie 2024 ────────────────────────────────────────────────────

export const RAM_1500: TechSpecSheet = {
  id: 'ram-1500-laramie-2024',
  createdAt: new Date().toISOString(),
  veiculo: { marca: 'RAM', modelo: 'RAM 1500 Laramie', versao: '5.7 HEMI V8 4x4 AT', ano: 2024, categoria: 'pickup' },
  motor: { cilindrada: '5.7L', tipo: 'HEMI V8 com MDS', potencia_cv: 401, torque_nm: 556, combustivel: 'Gasolina', transmissao: 'Automático 8 velocidades', tracao: '4x4' },
  dimensoes: { comprimento_mm: 5920, largura_mm: 2028, altura_mm: 1967, entre_eixos_mm: 3569, altura_livre_mm: 234, peso_kg: 2460, capacidade_carga_kg: 900, capacidade_reboque_kg: 4536 },
  eficiencia: { consumo_cidade: '6.5 km/l', consumo_estrada: '9.5 km/l', tanque_litros: 98, autonomia_km: 931 },
  seguranca: { airbags: '6 airbags', abs: 'Sim', controle_estabilidade: 'Sim', controle_tracao: 'Sim', assistente_frenagem: 'Sim' },
  tecnologia: { central_multimidia: 'Uconnect 5 - 12 polegadas', conectividade: 'Android Auto, Apple CarPlay, Bluetooth, Wi-Fi', camera_re: 'Câmera 360°', sensores_estacionamento: 'Dianteiros e traseiros', piloto_automatico: 'Adaptativo com Stop&Go' },
  preco: { fipe: 550000, referencia: 'Abril/2026' },
  metadata: { fonte: 'mock', campos_preenchidos: 28, total_campos: 28, is_simulado: false },
};

// ─── Toyota Corolla Cross XRE 2024 ───────────────────────────────────────────

export const COROLLA_CROSS: TechSpecSheet = {
  id: 'toyota-corolla-cross-xre-2024',
  createdAt: new Date().toISOString(),
  veiculo: { marca: 'Toyota', modelo: 'Corolla Cross', versao: 'XRE 2.0 Flex AWD CVT', ano: 2024, categoria: 'suv' },
  motor: { cilindrada: '2.0L', tipo: 'M20A-FKS Flex Dynamic Force', potencia_cv: 177, torque_nm: 204, combustivel: 'Flex', transmissao: 'CVT', tracao: 'AWD' },
  dimensoes: { comprimento_mm: 4460, largura_mm: 1825, altura_mm: 1620, entre_eixos_mm: 2640, altura_livre_mm: 190, peso_kg: 1470, capacidade_carga_kg: null, capacidade_reboque_kg: 1000 },
  eficiencia: { consumo_cidade: '11.5 km/l', consumo_estrada: '14.2 km/l', tanque_litros: 55, autonomia_km: 781 },
  seguranca: { airbags: '7 airbags', abs: 'Sim', controle_estabilidade: 'Sim (VSC)', controle_tracao: 'Sim', assistente_frenagem: 'Sim (Toyota Safety Sense)' },
  tecnologia: { central_multimidia: 'Toyota Multimedia - 9 polegadas', conectividade: 'Android Auto, Apple CarPlay, Bluetooth', camera_re: 'Câmera traseira', sensores_estacionamento: 'Dianteiros e traseiros', piloto_automatico: 'Adaptativo (RSA)' },
  preco: { fipe: 195000, referencia: 'Abril/2026' },
  metadata: { fonte: 'mock', campos_preenchidos: 27, total_campos: 28, is_simulado: false },
};

// ─── Honda CR-V Touring 2024 ──────────────────────────────────────────────────

export const CRV_TOURING: TechSpecSheet = {
  id: 'honda-crv-touring-2024',
  createdAt: new Date().toISOString(),
  veiculo: { marca: 'Honda', modelo: 'CR-V Touring', versao: '1.5 Turbo AWD CVT', ano: 2024, categoria: 'suv' },
  motor: { cilindrada: '1.5L', tipo: 'VTEC Turbo', potencia_cv: 193, torque_nm: 243, combustivel: 'Gasolina', transmissao: 'CVT', tracao: 'AWD' },
  dimensoes: { comprimento_mm: 4620, largura_mm: 1865, altura_mm: 1680, entre_eixos_mm: 2700, altura_livre_mm: 208, peso_kg: 1690, capacidade_carga_kg: null, capacidade_reboque_kg: 680 },
  eficiencia: { consumo_cidade: '11.8 km/l', consumo_estrada: '14.5 km/l', tanque_litros: 57, autonomia_km: 826 },
  seguranca: { airbags: '6 airbags', abs: 'Sim', controle_estabilidade: 'Sim (VSA)', controle_tracao: 'Sim', assistente_frenagem: 'Sim (Honda Sensing)' },
  tecnologia: { central_multimidia: 'Honda Connect - 9 polegadas', conectividade: 'Android Auto, Apple CarPlay, Bluetooth', camera_re: 'Câmera traseira multi-ângulo', sensores_estacionamento: 'Dianteiros e traseiros', piloto_automatico: 'Adaptativo com Low-Speed Follow' },
  preco: { fipe: 232000, referencia: 'Abril/2026' },
  metadata: { fonte: 'mock', campos_preenchidos: 27, total_campos: 28, is_simulado: false },
};

// ─── Hyundai Tucson GLS 2024 ──────────────────────────────────────────────────

export const TUCSON_GLS: TechSpecSheet = {
  id: 'hyundai-tucson-gls-2024',
  createdAt: new Date().toISOString(),
  veiculo: { marca: 'Hyundai', modelo: 'Tucson GLS', versao: '1.6 T-GDI DCT 7v', ano: 2024, categoria: 'suv' },
  motor: { cilindrada: '1.6L', tipo: 'T-GDI Turbo', potencia_cv: 150, torque_nm: 253, combustivel: 'Gasolina', transmissao: 'DCT 7 velocidades', tracao: '4x2' },
  dimensoes: { comprimento_mm: 4500, largura_mm: 1850, altura_mm: 1650, entre_eixos_mm: 2670, altura_livre_mm: 183, peso_kg: 1530, capacidade_carga_kg: null, capacidade_reboque_kg: 1650 },
  eficiencia: { consumo_cidade: '12.0 km/l', consumo_estrada: '15.0 km/l', tanque_litros: 54, autonomia_km: 810 },
  seguranca: { airbags: '6 airbags', abs: 'Sim', controle_estabilidade: 'Sim (ESC)', controle_tracao: 'Sim', assistente_frenagem: 'Sim' },
  tecnologia: { central_multimidia: 'Hyundai Sound - 10.25 polegadas', conectividade: 'Android Auto, Apple CarPlay, Bluetooth, Wi-Fi', camera_re: 'Câmera traseira', sensores_estacionamento: 'Dianteiros e traseiros', piloto_automatico: 'Adaptativo (SCC)' },
  preco: { fipe: 198000, referencia: 'Abril/2026' },
  metadata: { fonte: 'mock', campos_preenchidos: 27, total_campos: 28, is_simulado: false },
};

// ─── Jeep Compass Overland 2024 ───────────────────────────────────────────────

export const COMPASS_OVERLAND: TechSpecSheet = {
  id: 'jeep-compass-overland-2024',
  createdAt: new Date().toISOString(),
  veiculo: { marca: 'Jeep', modelo: 'Compass Overland', versao: 'T270 1.3 4x4 AT9', ano: 2024, categoria: 'suv' },
  motor: { cilindrada: '1.3L', tipo: 'T270 Turbo GSE', potencia_cv: 185, torque_nm: 270, combustivel: 'Gasolina', transmissao: 'Automático 9 velocidades', tracao: '4x4 HTRAC' },
  dimensoes: { comprimento_mm: 4395, largura_mm: 1810, altura_mm: 1695, entre_eixos_mm: 2636, altura_livre_mm: 202, peso_kg: 1636, capacidade_carga_kg: null, capacidade_reboque_kg: 1000 },
  eficiencia: { consumo_cidade: '10.5 km/l', consumo_estrada: '13.2 km/l', tanque_litros: 54, autonomia_km: 712 },
  seguranca: { airbags: '6 airbags', abs: 'Sim', controle_estabilidade: 'Sim (ESC)', controle_tracao: 'Sim', assistente_frenagem: 'Sim (FCW)' },
  tecnologia: { central_multimidia: 'Uconnect 5 - 10.1 polegadas', conectividade: 'Android Auto, Apple CarPlay, Bluetooth, Amazon Alexa', camera_re: 'Câmera 360° Park View', sensores_estacionamento: 'Dianteiros e traseiros', piloto_automatico: 'Adaptativo com Stop&Go' },
  preco: { fipe: 259000, referencia: 'Abril/2026' },
  metadata: { fonte: 'mock', campos_preenchidos: 27, total_campos: 28, is_simulado: false },
};

// ─── Nissan Frontier PRO-4X 2024 ─────────────────────────────────────────────

export const FRONTIER_PRO4X: TechSpecSheet = {
  id: 'nissan-frontier-pro4x-2024',
  createdAt: new Date().toISOString(),
  veiculo: { marca: 'Nissan', modelo: 'Frontier PRO-4X', versao: '2.5 Diesel 4x4 AT', ano: 2024, categoria: 'pickup' },
  motor: { cilindrada: '2.5L', tipo: 'YD25 Diesel Turbo', potencia_cv: 190, torque_nm: 450, combustivel: 'Diesel', transmissao: 'Automático 7 velocidades', tracao: '4x4' },
  dimensoes: { comprimento_mm: 5255, largura_mm: 1850, altura_mm: 1845, entre_eixos_mm: 3150, altura_livre_mm: 228, peso_kg: 2096, capacidade_carga_kg: 1060, capacidade_reboque_kg: 3400 },
  eficiencia: { consumo_cidade: '10.0 km/l', consumo_estrada: '12.5 km/l', tanque_litros: 80, autonomia_km: 1000 },
  seguranca: { airbags: '7 airbags', abs: 'Sim', controle_estabilidade: 'Sim (VDC)', controle_tracao: 'Sim', assistente_frenagem: 'Sim' },
  tecnologia: { central_multimidia: 'Nissan Connect - 9 polegadas', conectividade: 'Android Auto, Apple CarPlay, Bluetooth', camera_re: 'Câmera traseira 360°', sensores_estacionamento: 'Dianteiros e traseiros', piloto_automatico: 'Adaptativo (ProPILOT)' },
  preco: { fipe: 285000, referencia: 'Abril/2026' },
  metadata: { fonte: 'mock', campos_preenchidos: 28, total_campos: 28, is_simulado: false },
};

// ─── Ford Bronco Sport Badlands 2024 ─────────────────────────────────────────

export const BRONCO_SPORT: TechSpecSheet = {
  id: 'ford-bronco-sport-badlands-2024',
  createdAt: new Date().toISOString(),
  veiculo: { marca: 'Ford', modelo: 'Bronco Sport', versao: 'Badlands 2.0 EcoBoost 4x4 AT', ano: 2024, categoria: 'suv' },
  motor: { cilindrada: '2.0L', tipo: 'EcoBoost Turbo', potencia_cv: 250, torque_nm: 376, combustivel: 'Gasolina', transmissao: 'Automático 8 velocidades', tracao: '4x4 AWD' },
  dimensoes: { comprimento_mm: 4385, largura_mm: 1844, altura_mm: 1760, entre_eixos_mm: 2670, altura_livre_mm: 222, peso_kg: 1780, capacidade_carga_kg: null, capacidade_reboque_kg: 1588 },
  eficiencia: { consumo_cidade: '9.5 km/l', consumo_estrada: '12.0 km/l', tanque_litros: 60, autonomia_km: 720 },
  seguranca: { airbags: '7 airbags', abs: 'Sim', controle_estabilidade: 'Sim (ESC)', controle_tracao: 'Sim', assistente_frenagem: 'Sim' },
  tecnologia: { central_multimidia: 'Ford SYNC 4 - 8 polegadas', conectividade: 'Android Auto, Apple CarPlay, Bluetooth, Wi-Fi', camera_re: 'Câmera traseira', sensores_estacionamento: 'Traseiros', piloto_automatico: 'Adaptativo (ACC)' },
  preco: { fipe: 299000, referencia: 'Abril/2026' },
  metadata: { fonte: 'mock', campos_preenchidos: 27, total_campos: 28, is_simulado: false },
};

// ─── Índice de todos os mocks — usado pelo specService ───────────────────────

export const TODOS_OS_MOCKS: TechSpecSheet[] = [
  RANGER_RAPTOR,
  HILUX_GR_SPORT,
  AMAROK_V6,
  L200_TRITON,
  S10_HIGH_COUNTRY,
  RAM_1500,
  COROLLA_CROSS,
  CRV_TOURING,
  TUCSON_GLS,
  COMPASS_OVERLAND,
  FRONTIER_PRO4X,
  BRONCO_SPORT,
];
