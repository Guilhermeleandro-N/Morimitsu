import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class AlunoEntity {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  frequencia_atual!: number;

  @ApiProperty()
  grau_faixa!: number;

  @ApiProperty()
  faixa!: string;

  @ApiPropertyOptional({ type: String, nullable: true })
  data_nascimento!: Date | null;

  @ApiProperty()
  usuarioId!: string;
}
