import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ProfessorEntity {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  faixa!: string;

  @ApiProperty()
  grau!: number;

  @ApiProperty()
  usuarioId!: string;

  @ApiPropertyOptional()
  nome?: string;

  @ApiPropertyOptional()
  email?: string;

  @ApiPropertyOptional({ nullable: true })
  telefone?: string | null;

  @ApiPropertyOptional()
  status?: string;

  @ApiPropertyOptional({ nullable: true })
  arquivado_at?: Date | null;

  @ApiPropertyOptional({
    type: [String],
    description: 'Roles do usuário (ex: professor)',
  })
  roles?: string[];

  @ApiPropertyOptional({ type: [String], description: 'Permissões do usuário' })
  permissoes?: string[];
}
