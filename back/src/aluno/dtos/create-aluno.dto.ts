import { IsNotEmpty, IsString, Max, MaxLength, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAlunoDto {
  @ApiProperty({
    example: 'João Silva',
    description: 'Nome completo do aluno',
  })
  @IsString()
  @IsNotEmpty({ message: 'Nome é obrigatório' })
  nome!: string;

  @ApiProperty({
    example: '11987654321',
    description: 'Telefone do aluno',
  })
  @IsString()
  @IsNotEmpty({ message: 'Telefone é obrigatório' })
  telefone!: string;

  @ApiProperty({
    example: 75,
    description: 'Frequência atual do aluno em porcentagem',
  })
  @Max(120, { message: 'Frequência não pode ser maior que 100%' })
  @Min(0, { message: 'Frequência não pode ser negativa' })
  frequenciaAtual!: number;

  @ApiProperty({ example: 'Faixa Preta', description: 'Faixa atual do aluno' })
  @IsString()
  @IsNotEmpty({ message: 'Faixa é obrigatória' })
  @MaxLength(30, { message: 'Faixa deve ter no máximo 30 caracteres' })
  faixa!: string;

  @ApiProperty({ example: 1, description: 'Grau da faixa do aluno' })
  @IsNotEmpty({ message: 'Grau é obrigatório' })
  @Max(4, { message: 'Grau maximo por faixa é 4' })
  @Min(0, { message: 'Grau não pode ser negativo' })
  grau!: number;
}
