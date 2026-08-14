import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsIn,
  IsOptional,
  IsString,
} from 'class-validator';

export class UpdateAlunoTurmaDto {
  @ApiPropertyOptional({ enum: ['S', 'N'], description: 'S = ativo, N = inativo' })
  @IsOptional()
  @IsString()
  @IsIn(['S', 'N'])
  frequente?: string;

  @ApiPropertyOptional({
    description: 'true para arquivar o aluno na turma, false para reativar',
  })
  @IsOptional()
  @IsBoolean()
  arquivado?: boolean;
}
