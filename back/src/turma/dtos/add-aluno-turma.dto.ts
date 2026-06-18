import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class AddAlunoTurmaDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'aluno_id é obrigatório' })
  aluno_id!: string;

  @ApiPropertyOptional({ enum: ['S', 'N'], default: 'S' })
  @IsOptional()
  @IsString()
  @IsIn(['S', 'N'])
  frequente?: string;
}
