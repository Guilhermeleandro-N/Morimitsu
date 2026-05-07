import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class UpdateAlunoDto {
  @IsString()
  @IsOptional()
  faixa?: string;

  @IsInt()
  @Min(0)
  @IsOptional()
  grau_faixa?: number;

  @IsInt()
  @Min(0)
  @IsOptional()
  frequencia_atual?: number;
}
