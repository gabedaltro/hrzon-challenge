const DV1_WEIGHTS = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
const DV2_WEIGHTS = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];

function digit(chars: string, weights: number[]): string {
  const sum = chars.split('').reduce((total, char, index) => total + (char.charCodeAt(0) - 48) * weights[index], 0);

  const rest = sum % 11;

  return String(rest < 2 ? 0 : 11 - rest);
}

/**
 * CNPJ alfanumérico: 12 posições alfanuméricas e 2 dígitos verificadores numéricos,
 * calculados pelo módulo 11 sobre o valor (ASCII - 48) de cada caractere.
 * A mesma checagem existe no servidor — aqui ela serve para avisar o usuário antes do envio.
 */
export function cnpjValidator(value?: string | null): boolean {
  if (!value) return false;

  const cnpj = value.replace(/[^A-Za-z0-9]/g, '').toUpperCase();

  if (!/^[A-Z0-9]{12}\d{2}$/.test(cnpj)) return false;

  if (/^(.)\1{11}\d{2}$/.test(cnpj)) return false;

  const base = cnpj.substring(0, 12);
  const dv1 = digit(base, DV1_WEIGHTS);
  const dv2 = digit(base + dv1, DV2_WEIGHTS);

  return cnpj.substring(12) === dv1 + dv2;
}
