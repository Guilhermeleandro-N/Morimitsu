import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDate,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateFrequenciaProfDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'professor_id é obrigatório' })
  professor_id!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'turma_id é obrigatório' })
  turma_id!: string;

  @ApiProperty({ example: '2024-06-15T00:00:00.000Z' })
  @Type(() => Date)
  @IsDate()
  data!: Date;

  @ApiProperty({ enum: ['REALIZADA', 'CANCELADA', 'REMARCADA'] })
  @IsString()
  @IsIn(['REALIZADA', 'CANCELADA', 'REMARCADA'], {
    message: 'status_aula deve ser REALIZADA, CANCELADA ou REMARCADA',
  })
  status_aula!: string;

  @ApiPropertyOptional({ example: '2024-06-20T00:00:00.000Z' })
  @Type(() => Date)
  @IsDate()
  @IsOptional()
  data_remarcacao?: Date;
}
