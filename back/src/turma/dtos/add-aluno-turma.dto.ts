import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class AddAlunoTurmaDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'aluno_id é obrigatório' })
  aluno_id!: string;
}
