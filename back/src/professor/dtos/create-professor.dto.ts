import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';

export class CreateProfessorDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'usuarioId é obrigatório' })
  usuarioId!: string;

  @ApiProperty({ example: 'Preta' })
  @IsString()
  @IsOptional()
  faixa?: string;

  @ApiProperty({ example: 1 })
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
