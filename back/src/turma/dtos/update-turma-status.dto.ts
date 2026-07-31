import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsNotEmpty, IsString } from 'class-validator';

export class UpdateTurmaStatusDto {
  @ApiProperty({ enum: ['ATIVO', 'INATIVO'], description: 'ATIVO ou INATIVO' })
  @IsString()
  @IsNotEmpty()
  @IsIn(['ATIVO', 'INATIVO'])
  status!: string;
}
