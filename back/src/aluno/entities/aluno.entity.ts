import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { FrequenciaHistoricoItem } from './aluno-freq.entity';
export class AlunoEntity {
  @ApiPropertyOptional()
  nome?: string;

  @ApiPropertyOptional()
  email?: string;

  @ApiPropertyOptional({ nullable: true })
  telefone?: string | null;

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

  @ApiPropertyOptional({ description: 'Total de presencas registradas' })
  total_presencas?: number;

  @ApiPropertyOptional({ type: [FrequenciaHistoricoItem] })
  historico_frequencias?: FrequenciaHistoricoItem[];

  @ApiPropertyOptional({ type: [String], description: 'Roles do usuário (ex: aluno, professor)' })
  roles?: string[];

  @ApiPropertyOptional({ type: [String], description: 'Permissões do usuário' })
  permissoes?: string[];
}
