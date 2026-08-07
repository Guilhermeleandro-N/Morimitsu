import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, IsUUID, Min } from 'class-validator';

export class GraduarAlunoDto {
  @ApiPropertyOptional({
    example: 'AZUL',
    description: 'Nova faixa (override manual)',
  })
  @IsOptional()
  @IsString()
  faixa?: string;

  @ApiPropertyOptional({
    example: 2,
    description: 'Novo grau (override manual)',
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  grau_faixa?: number;
}

export class GraduarProximoNivelDto {
  @ApiPropertyOptional({
    example: 'uuid-da-turma',
    description:
      'Turma em que a graduação está acontecendo. A frequência desta turma é zerada após a graduação.',
  })
  @IsOptional()
  @IsUUID()
  turma_id?: string;
}
