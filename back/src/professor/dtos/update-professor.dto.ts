import { ApiProperty } from '@nestjs/swagger';
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
}
