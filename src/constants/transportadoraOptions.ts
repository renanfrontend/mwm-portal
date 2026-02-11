export type TransportadoraOption = {
  label: string;
  value: string;
};

export const VEHICLE_TYPE_OPTIONS: TransportadoraOption[] = [
  { label: 'Caminhão Truck', value: 'Caminhão Truck' },
  { label: 'Carreta', value: 'Carreta' },
  { label: 'Bitrem', value: 'Bitrem' },
  { label: 'VUC', value: 'VUC' },
  { label: 'Utilitário', value: 'Utilitário' },
  { label: 'Empilhadeira', value: 'Empilhadeira' }
];

export const FUEL_TYPE_OPTIONS: TransportadoraOption[] = [
  { label: 'Diesel', value: 'Diesel' },
  { label: 'Biometano', value: 'Biometano' }
];
