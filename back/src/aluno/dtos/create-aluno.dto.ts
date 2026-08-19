import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';

export class CreateAlunoDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'usuarioId é obrigatório' })
  usuarioId!: string;

  @ApiPropertyOptional({ example: 'Branca' })
  @IsString()
  @IsOptional()
  faixa?: string;

  @ApiPropertyOptional({ example: 0 })
  @IsInt()
  @Min(0)
  @IsOptional()
  grau_faixa?: number;

  @ApiPropertyOptional({ example: 20 })
  @IsInt()
  @Min(0)
  @IsOptional()
  frequencia_atual?: number;
}
