import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class UpdateAlunoDto {
  @ApiPropertyOptional({ example: 'Azul' })
  @IsString()
  @IsOptional()
  faixa?: string;

  @ApiPropertyOptional({ example: 1 })
  @IsInt()
  @Min(0)
  @IsOptional()
  grau_faixa?: number;

  @ApiPropertyOptional({ example: 10 })
  @IsInt()
  @Min(0)
  @IsOptional()
  frequencia_atual?: number;
}
