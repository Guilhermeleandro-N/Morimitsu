import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';

export class CreateAlunoDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'usuarioId é obrigatório' })
  usuarioId!: string;

  @ApiProperty({ example: 'Branca' })
  @IsString()
  @IsOptional()
  faixa?: string;

  @ApiProperty({ example: 0 })
  @IsInt()
  @Min(0)
  @IsOptional()
  grau_faixa?: number;
}
