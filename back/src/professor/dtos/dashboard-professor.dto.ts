import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class AlunoGraduacaoProximaDto {
  @ApiProperty()
  aluno_id!: string;

  @ApiProperty()
  nome!: string;

  @ApiProperty()
  faixa!: string;

  @ApiProperty()
  grau_faixa!: number;

  @ApiProperty()
  frequencia_atual!: number;

  @ApiProperty({
    description: 'Frequências restantes para a próxima graduação',
  })
  frequencias_restantes!: number;

  @ApiProperty()
  turma_id!: string;

  @ApiProperty()
  turma_nome!: string;

  @ApiProperty({ enum: ['S', 'N'] })
  frequente!: string;
}

export class AlunoAniversarioProximoDto {
  @ApiProperty()
  aluno_id!: string;

  @ApiProperty()
  nome!: string;

  @ApiProperty()
  faixa!: string;

  @ApiProperty({ description: 'Data de nascimento (formato ISO)' })
  data_nascimento!: string;

  @ApiProperty({ description: 'Dias restantes até o aniversário' })
  dias_restantes!: number;

  @ApiProperty()
  turma_id!: string;

  @ApiProperty()
  turma_nome!: string;

  @ApiProperty({ enum: ['S', 'N'] })
  frequente!: string;
}

export class DashboardProfessorResponseDto {
  @ApiProperty({ type: [AlunoGraduacaoProximaDto] })
  proximos_graduacao!: AlunoGraduacaoProximaDto[];

  @ApiProperty({ type: [AlunoAniversarioProximoDto] })
  proximos_aniversario!: AlunoAniversarioProximoDto[];
}
