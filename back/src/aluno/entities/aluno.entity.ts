export class AlunoEntity {
  constructor(
    public readonly id: string,
    public readonly nome: string,
    public readonly telefone: string,
    public readonly frequencia_atual: number,
    public readonly faixa: string,
    public readonly grau: number,
  ) {}
}
