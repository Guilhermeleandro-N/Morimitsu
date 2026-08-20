export const PROGRESSAO_FAIXAS = [
  'BRANCA',
  'CINZA',
  'AMARELA',
  'LARANJA',
  'VERDE',
  'AZUL',
  'ROXA',
  'MARROM',
  'PRETA',
];

export const FAIXAS_MAIORES = ['BRANCA', 'AZUL', 'ROXA', 'MARROM', 'PRETA'];
export const FAIXAS_CRIANCAS = [
  'BRANCA',
  'CINZA',
  'AMARELA',
  'LARANJA',
  'VERDE',
];
export const IDADE_LIMITE_FAIXA = 16;

export const FREQUENCIAS_POR_GRAU = 30;
export const GRAUS_POR_FAIXA = 4;

export function calcularIdade(dataNascimento: Date): number {
  const hoje = new Date();
  let idade = hoje.getFullYear() - dataNascimento.getFullYear();
  const m = hoje.getMonth() - dataNascimento.getMonth();
  if (m < 0 || (m === 0 && hoje.getDate() < dataNascimento.getDate())) {
    idade--;
  }
  return idade;
}

export function faixaPermitidaParaIdade(
  faixa: string,
  dataNascimento: Date | null | undefined,
): boolean {
  if (!dataNascimento) return true;
  const permitidas =
    calcularIdade(dataNascimento) > IDADE_LIMITE_FAIXA
      ? FAIXAS_MAIORES
      : FAIXAS_CRIANCAS;
  return permitidas.includes((faixa || '').toUpperCase());
}
