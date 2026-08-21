import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class UpdateProfessorDto {
  @ApiProperty({ example: 'Marrom' })
  @IsString()
  @IsOptional()
  faixa?: string;

  @ApiProperty({ example: 2 })
  @IsInt()
  @Min(0)
  @IsOptional()
  grau?: number;

  @ApiPropertyOptional({ example: 20 })
  @IsInt()
  @Min(0)
  @IsOptional()
  frequencia_atual?: number;

  @ApiPropertyOptional({ example: '2000-05-10' })
  @IsString()
  @IsOptional()
  data_nascimento?: string;
}
