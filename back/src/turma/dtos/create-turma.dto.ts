import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsDate,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateTurmaDto {
  @ApiProperty({ example: 'Turma Infantil' })
  @IsString()
  @IsNotEmpty({ message: 'Nome é obrigatório' })
  nome!: string;

  @ApiProperty({ example: '08:00:00' })
  @Type(() => Date)
  @IsDate()
  horario_inicio!: Date;

  @ApiProperty({ example: '09:00:00' })
  @Type(() => Date)
  @IsDate()
  horario_fim!: Date;

  @ApiPropertyOptional({ example: '2024-06-15T00:00:00.000Z' })
  @Type(() => Date)
  @IsDate()
  @IsOptional()
  data_especifica?: Date;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  segunda?: boolean;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  terca?: boolean;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  quarta?: boolean;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  quinta?: boolean;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  sexta?: boolean;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  sabado?: boolean;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  domingo?: boolean;

  @ApiPropertyOptional({ default: true })
  @IsBoolean()
  @IsOptional()
  ativo?: boolean;
}
