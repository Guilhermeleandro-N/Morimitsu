import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty } from 'class-validator';

export class UpdateTurmaStatusDto {
  @ApiProperty({ description: 'true = ativa, false = inativa' })
  @IsBoolean()
  @IsNotEmpty()
  ativo!: boolean;
}
