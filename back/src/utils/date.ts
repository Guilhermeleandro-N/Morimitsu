export function formatarDataNascimento(data: Date | null): string | null {
  if (!data || isNaN(data.getTime())) return null;
  const dia = String(data.getUTCDate()).padStart(2, '0');
  const mes = String(data.getUTCMonth() + 1).padStart(2, '0');
  const ano = data.getUTCFullYear();
  return `${dia}/${mes}/${ano}`;
}
