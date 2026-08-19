import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  ArrayNotEmpty,
  IsArray,
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class RelatorioTreinoDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'turma_id é obrigatório' })
  turma_id!: string;

  @ApiProperty()
  @IsArray()
  @ArrayNotEmpty({ message: 'alunos_presentes deve ter pelo menos um aluno' })
  @IsString({ each: true })
  alunos_presentes!: string[];
}
