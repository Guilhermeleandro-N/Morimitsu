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

  @ApiProperty({ nullable: true })
  data_especifica!: Date | null;

  @ApiProperty({
    example: 'ATIVO',
    description: 'Status da turma: ATIVO ou INATIVO',
  })
  status!: string;

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

  @ApiPropertyOptional({ type: [String], description: 'Nomes dos professores vinculados' })
  professores?: string[];
}
