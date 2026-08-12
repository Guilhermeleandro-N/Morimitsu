import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsBoolean, IsDate, IsIn, IsOptional, IsString } from 'class-validator';

export class UpdateTurmaDto {
  @ApiProperty({ example: 'Turma Avançada' })
  @IsString()
  @IsOptional()
  nome?: string;

  @ApiProperty({ example: '2024-01-01T08:00:00.000Z' })
  @Type(() => Date)
  @IsDate()
  @IsOptional()
  horario_inicio?: Date;

  @ApiProperty({ example: '2024-01-01T09:00:00.000Z' })
  @Type(() => Date)
  @IsDate()
  @IsOptional()
  horario_fim?: Date;

  @ApiProperty({ enum: ['ATIVO', 'INATIVO'], example: 'ATIVO' })
  @IsString()
  @IsOptional()
  @IsIn(['ATIVO', 'INATIVO'])
  status?: string;

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  segunda?: boolean;

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  terca?: boolean;

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  quarta?: boolean;

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  quinta?: boolean;

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  sexta?: boolean;

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  sabado?: boolean;

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  domingo?: boolean;
}
