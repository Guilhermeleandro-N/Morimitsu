import { IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';

export class CreateProfessorDto {
  @IsString()
  @IsNotEmpty({ message: 'usuarioId é obrigatório' })
  usuarioId!: string;

  @IsString()
  @IsOptional()
  faixa?: string;

  @IsInt()
  @Min(0)
  @IsOptional()
  grau?: number;
}
