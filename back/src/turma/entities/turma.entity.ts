import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class TurmaEntity {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  nome!: string;

  @ApiProperty()
  horario_inicio!: Date;

  @ApiProperty()
  horario_fim!: Date;

  @ApiProperty({
    example: 'ATIVO',
    description: 'Status da turma: ATIVO, INATIVO ou ARQUIVADA',
  })
  status!: string;

  @ApiPropertyOptional({ type: String, nullable: true })
  arquivada_em!: Date | null;

  @ApiProperty()
  segunda!: boolean;

  @ApiProperty()
  terca!: boolean;

  @ApiProperty()
  quarta!: boolean;

  @ApiProperty()
  quinta!: boolean;

  @ApiProperty()
  sexta!: boolean;

  @ApiProperty()
  sabado!: boolean;

  @ApiProperty()
  domingo!: boolean;

  @ApiPropertyOptional({
    type: [String],
    description: 'Nomes dos professores vinculados',
  })
  professores?: string[];
}
