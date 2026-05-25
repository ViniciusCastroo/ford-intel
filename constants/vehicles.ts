// Lista de marcas disponíveis para chips de sugestão
export const MARCAS = [
  'Ford', 'Toyota', 'Volkswagen', 'Chevrolet', 'Honda',
  'Hyundai', 'Nissan', 'Mitsubishi', 'RAM', 'Jeep',
  'Renault', 'Fiat', 'Mercedes-Benz', 'Land Rover',
];

// Modelos agrupados por marca — para sugestões rápidas
export const VEICULOS_POR_MARCA: Record<string, string[]> = {
  'Ford': ['Ranger Raptor', 'Ranger XLS', 'Bronco Sport', 'Territory', 'Maverick'],
  'Toyota': ['Hilux GR Sport', 'Hilux SRV', 'SW4', 'Corolla Cross', 'RAV4', 'Land Cruiser'],
  'Volkswagen': ['Amarok V6', 'Amarok Comfortline', 'Taos', 'T-Cross', 'Tiguan'],
  'Chevrolet': ['S10 High Country', 'S10 LTZ', 'Trailblazer', 'Tracker', 'Equinox'],
  'Honda': ['CR-V', 'HR-V', 'Civic', 'Fit'],
  'Hyundai': ['Tucson', 'Santa Fe', 'Creta', 'HB20'],
  'Nissan': ['Frontier', 'Kicks', 'Versa', 'Sentra'],
  'Mitsubishi': ['L200 Triton', 'Eclipse Cross', 'Outlander', 'ASX'],
  'RAM': ['1500 Laramie', '700 Rebel', '2500 Laramie'],
  'Jeep': ['Compass', 'Renegade', 'Commander', 'Wrangler'],
  'Renault': ['Duster', 'Captur', 'Kwid', 'Oroch'],
  'Fiat': ['Toro', 'Pulse', 'Strada', 'Fastback'],
  'Mercedes-Benz': ['GLE', 'GLC', 'GLA', 'Classe C'],
  'Land Rover': ['Defender', 'Discovery Sport', 'Range Rover Evoque'],
};
