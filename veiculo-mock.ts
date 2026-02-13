// Mock implementations for vehicle endpoints
export const mockFetchVeiculoTipos = (): Promise<VeiculoTipoOption[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { id: 1, label: "Truck", value: "truck" },
        { id: 2, label: "Carreta", value: "carreta" },
        { id: 3, label: "Bitrem", value: "bitrem" },
        { id: 4, label: "VUC", value: "vuc" },
        { id: 5, label: "Utilitário", value: "utilitario" },
        { id: 6, label: "Empilhadeira", value: "empilhadeira" }
      ]);
    }, 300);
  });
};

export const mockFetchVeiculoCombustiveis = (): Promise<VeiculoCombustivelOption[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { id: 1, label: "Diesel", value: "diesel" },
        { id: 2, label: "Biomethane", value: "biomethane" }
      ]);
    }, 300);
  });
};