import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class UpdateProfessorDto {
  @IsString()
  @IsOptional()
  faixa?: string;

  @IsInt()
  @Min(0)
  @IsOptional()
  grau?: number;
}
