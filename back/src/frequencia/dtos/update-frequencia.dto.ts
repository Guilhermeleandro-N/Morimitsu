import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsIn, IsOptional, IsString } from 'class-validator';

export class UpdateFrequenciaDto {
  @ApiPropertyOptional({ enum: ['PRESENTE', 'AUSENTE'] })
  @IsString()
  @IsIn(['PRESENTE', 'AUSENTE'], {
    message: 'status_presenca deve ser PRESENTE ou AUSENTE',
  })
  @IsOptional()
  status_presenca?: string;

  @ApiPropertyOptional({ example: '25/06/2024' })
  @Type(() => Date)
  @IsDate()
  @IsOptional()
  data?: Date;

  @ApiPropertyOptional({ example: '07:00:00' })
  @Type(() => Date)
  @IsDate()
  @IsOptional()
  horario_inicio?: Date;

  @ApiPropertyOptional({ example: '08:00:00' })
  @Type(() => Date)
  @IsDate()
  @IsOptional()
  horario_fim?: Date;
}
