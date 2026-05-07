import { Type } from 'class-transformer';
import { IsBoolean, IsDate, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateTurmaDto {
  @IsString()
  @IsNotEmpty({ message: 'Nome é obrigatório' })
  nome!: string;

  @Type(() => Date)
  @IsDate()
  horario_inicio!: Date;

  @Type(() => Date)
  @IsDate()
  horario_fim!: Date;

  @Type(() => Date)
  @IsDate()
  @IsOptional()
  data_especifica?: Date;

  @IsBoolean()
  @IsOptional()
  segunda?: boolean;

  @IsBoolean()
  @IsOptional()
  terca?: boolean;

  @IsBoolean()
  @IsOptional()
  quarta?: boolean;

  @IsBoolean()
  @IsOptional()
  quinta?: boolean;

  @IsBoolean()
  @IsOptional()
  sexta?: boolean;

  @IsBoolean()
  @IsOptional()
  sabado?: boolean;

  @IsBoolean()
  @IsOptional()
  domingo?: boolean;
}
