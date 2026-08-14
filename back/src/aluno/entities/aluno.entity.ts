import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { FrequenciaHistoricoItem } from './aluno-freq.entity';
export class AlunoEntity {
  @ApiPropertyOptional()
  nome?: string;

  @ApiPropertyOptional()
  email?: string;

  @ApiPropertyOptional({ nullable: true })
  telefone?: string | null;

  @ApiPropertyOptional({ type: String, nullable: true })
  data_nascimento?: Date | null;

  @ApiPropertyOptional({ description: 'Status do usuário (ENABLED/DISABLED)' })
  status?: string;

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

  @ApiPropertyOptional({ description: 'Total de presencas registradas' })
  total_presencas?: number;

  @ApiPropertyOptional({ type: [FrequenciaHistoricoItem] })
  historico_frequencias?: FrequenciaHistoricoItem[];

  @ApiPropertyOptional({
    type: [String],
    description: 'Roles do usuário (ex: aluno, professor)',
  })
  roles?: string[];

  @ApiPropertyOptional({ type: [String], description: 'Permissões do usuário' })
  permissoes?: string[];

  @ApiPropertyOptional({
    description: 'Status do vínculo na turma (S=ativo, N=inativo)',
  })
  frequente?: string;

  @ApiPropertyOptional({ type: String, nullable: true })
  arquivado_at?: Date | null;
}
