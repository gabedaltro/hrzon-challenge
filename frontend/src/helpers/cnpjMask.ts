/**
 * Máscara progressiva do CNPJ alfanumérico: as 12 primeiras posições aceitam letras e
 * números, e os 2 dígitos verificadores só números.
 */
export function cnpjMask(value: string): string {
  const clean = value
    .replace(/[^A-Za-z0-9]/g, '')
    .toUpperCase()
    .slice(0, 14);

  const cnpj = clean.slice(0, 12) + clean.slice(12).replace(/\D/g, '');

  let masked = cnpj.slice(0, 2);

  if (cnpj.length > 2) masked += `.${cnpj.slice(2, 5)}`;
  if (cnpj.length > 5) masked += `.${cnpj.slice(5, 8)}`;
  if (cnpj.length > 8) masked += `/${cnpj.slice(8, 12)}`;
  if (cnpj.length > 12) masked += `-${cnpj.slice(12, 14)}`;

  return masked;
}
