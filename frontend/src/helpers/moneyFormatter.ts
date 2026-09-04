const formatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
});

export function moneyFormatter(value?: string | number | null): string {
  const parsed = typeof value === 'number' ? value : parseFloat(value ?? '');

  if (isNaN(parsed)) return formatter.format(0);

  return formatter.format(parsed);
}
