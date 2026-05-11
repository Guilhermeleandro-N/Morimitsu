import { ApiProperty } from '@nestjs/swagger';

export class AlunoEntity {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  frequencia_atual!: number;

  @ApiProperty()
  grau_faixa!: number;

  @ApiProperty()
  faixa!: string;

  @ApiProperty()
  usuarioId!: string;
}
