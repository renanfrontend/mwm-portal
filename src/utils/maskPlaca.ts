// Função utilitária para formatar placa padrão Mercosul (ABC-1234 ou ABC-1D23)
export function maskPlaca(value: string): string {
  let v = value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
  if (v.length <= 3) return v;
  if (v.length <= 7) return v.slice(0, 3) + '-' + v.slice(3, 7);
  return v.slice(0, 3) + '-' + v.slice(3, 7);
}
