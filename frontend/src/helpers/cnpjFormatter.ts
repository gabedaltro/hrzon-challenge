/**
 * Formata o CNPJ alfanumérico (12 caracteres alfanuméricos + 2 dígitos verificadores).
 * Valor fora do padrão volta como veio, sem máscara parcial.
 */
export function cnpjFormatter(value?: string | null): string {
  if (!value) return '';

  const clean = value.replace(/[^A-Za-z0-9]/g, '').toUpperCase();

  return clean.replace(/^([A-Z0-9]{2})([A-Z0-9]{3})([A-Z0-9]{3})([A-Z0-9]{4})(\d{2})$/, '$1.$2.$3/$4-$5');
}
