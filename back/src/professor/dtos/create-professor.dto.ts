import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, IsUUID, Min } from 'class-validator';

export class CreateProfessorDto {
  @ApiProperty({
    description: 'ID do usuário (obrigatório se alunoId não for informado)',
  })
  @IsString()
  @IsOptional()
  usuarioId?: string;

  @ApiProperty({
    description:
      'ID do aluno a ser promovido a professor. Se informado, usa os dados do aluno automaticamente.',
  })
  @IsUUID()
  @IsOptional()
  alunoId?: string;

  @ApiProperty({ example: 'Preta', description: 'Faixa do professor' })
  @IsString()
  @IsOptional()
  faixa?: string;

  @ApiProperty({ example: 1, description: 'Grau do professor' })
  @IsInt()
  @Min(0)
  @IsOptional()
  grau?: number;
}
