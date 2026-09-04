const formatter = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
});

export function dateFormatter(value?: string | null): string {
  if (!value) return '';

  const date = new Date(value);

  if (isNaN(date.getTime())) return '';

  return formatter.format(date);
}
