import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsIn, IsOptional, IsString } from 'class-validator';

export class UpdateFrequenciaProfDto {
  @ApiPropertyOptional({ enum: ['REALIZADA', 'CANCELADA', 'REMARCADA'] })
  @IsString()
  @IsIn(['REALIZADA', 'CANCELADA', 'REMARCADA'], {
    message: 'status_aula deve ser REALIZADA, CANCELADA ou REMARCADA',
  })
  @IsOptional()
  status_aula?: string;

  @ApiPropertyOptional({ example: '26/06/2024' })
  @Type(() => Date)
  @IsDate()
  @IsOptional()
  data?: Date;

  @ApiPropertyOptional({ example: '27/06/2024' })
  @Type(() => Date)
  @IsDate()
  @IsOptional()
  data_remarcacao?: Date;
}
