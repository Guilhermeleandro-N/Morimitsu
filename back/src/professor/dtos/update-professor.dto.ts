import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsInt, IsOptional, IsString, Min } from 'class-validator';

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

  @ApiProperty({ enum: ['ATIVO', 'INATIVO', 'DESLIGADO'], example: 'ATIVO' })
  @IsString()
  @IsIn(['ATIVO', 'INATIVO', 'DESLIGADO'])
  @IsOptional()
  status?: string;
}
