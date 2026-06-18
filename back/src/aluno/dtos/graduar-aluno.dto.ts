import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, Min } from 'class-validator';

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
