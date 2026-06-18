import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsNotEmpty, IsString } from 'class-validator';

export class UpdateAlunoTurmaDto {
  @ApiProperty({ enum: ['S', 'N'], description: 'S = ativo, N = inativo' })
  @IsString()
  @IsNotEmpty()
  @IsIn(['S', 'N'])
  frequente!: string;
}
