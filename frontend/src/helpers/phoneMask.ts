/** Máscara progressiva de telefone com DDD, para fixo (10 dígitos) e celular (11 dígitos). */
export function phoneMask(value: string): string {
  const clean = value.replace(/\D/g, '').slice(0, 11);

  if (!clean) return '';

  if (clean.length <= 2) return `(${clean}`;

  const middleEnd = clean.length > 10 ? 7 : 6;
  const middle = clean.slice(2, middleEnd);
  const end = clean.slice(middleEnd);

  return `(${clean.slice(0, 2)}) ${middle}${end ? `-${end}` : ''}`;
}
